provider "aws" {
  region = "us-east-1"
}

variable "public_key" {
  description = "SSH public key for EC2 access"
  type        = string
}

resource "aws_security_group" "nodejs_sg" {
  name        = "backend-security-group"
  description = "SG for backend with SSH, HTTP and HTTPS"

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS (SSL)"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP (backend interno)"
    from_port   = 3001
    to_port     = 3001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_key_pair" "nodejs_ssh" {
  key_name   = "nodejs-ssh"
  public_key = var.public_key
}

resource "aws_instance" "nodejs_server" {
  ami                    = "ami-01816d07b1128cd2d"
  instance_type          = "t2.micro"
  key_name               = aws_key_pair.nodejs_ssh.key_name
  vpc_security_group_ids = [aws_security_group.nodejs_sg.id]

  tags = {
    Name = "NodeJS-App-Server"
  }

  provisioner "remote-exec" {
    connection {
      type        = "ssh"
      host        = self.public_ip
      user        = "ec2-user"
      private_key = file("${path.module}/id_rsa")
    }

    inline = [
      "sudo bash -c 'cat <<EOF > /etc/nginx/conf.d/backend.conf\n" +
      "server {\n" +
      "    listen 443 ssl;\n" +
      "    server_name _;\n" +
      "    ssl_certificate /etc/ssl/certs/selfsigned.crt;\n" +
      "    ssl_certificate_key /etc/ssl/private/selfsigned.key;\n" +
      "    ssl_protocols TLSv1.2 TLSv1.3;\n" +
      "    ssl_ciphers HIGH:!aNULL:!MD5;\n" +
      "    location / {\n" +
      "        proxy_pass http://127.0.0.1:3001;\n" +
      "        proxy_http_version 1.1;\n" +
      "        proxy_set_header Upgrade \\$http_upgrade;\n" +
      "        proxy_set_header Connection \"upgrade\";\n" +
      "        proxy_set_header Host \\$host;\n" +
      "        proxy_cache_bypass \\$http_upgrade;\n" +
      "    }\n" +
      "}\n" +
      "EOF'"
    ]
  }
}

resource "aws_eip" "nodejs_eip" {
  domain = "vpc"
}

resource "aws_eip_association" "nodejs_eip_assoc" {
  instance_id   = aws_instance.nodejs_server.id
  allocation_id = aws_eip.nodejs_eip.id
}

output "ec2_public_ip" {
  value = aws_instance.nodejs_server.public_ip
}

output "application_url_https" {
  value = "https://${aws_eip.nodejs_eip.public_ip}"
}