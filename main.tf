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
      "sudo yum update -y",
      "sudo yum install -y git nginx openssl",
      "curl -fsSL https://rpm.nodesource.com/setup_16.x | sudo bash -",
      "sudo yum install -y nodejs",
      "git clone https://github.com/Khenya/venta-de-bienes-ra-ces-caso-Raices-Backend /home/ec2-user/app",
      "cd /home/ec2-user/app && npm install",
      "nohup npm run dev > /home/ec2-user/app.log 2>&1 &",
      "sudo mkdir -p /etc/ssl/certs /etc/ssl/private",
      "sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/selfsigned.key -out /etc/ssl/certs/selfsigned.crt -subj \"/CN=localhost\"",
      <<-EOF
      sudo tee /etc/nginx/conf.d/backend.conf > /dev/null <<NGINX_CONF
      server {
          listen 443 ssl;
          server_name _;
          ssl_certificate /etc/ssl/certs/selfsigned.crt;
          ssl_certificate_key /etc/ssl/private/selfsigned.key;
          ssl_protocols TLSv1.2 TLSv1.3;
          ssl_ciphers HIGH:!aNULL:!MD5;
          location / {
              proxy_pass http://127.0.0.1:3001;
              proxy_http_version 1.1;
              proxy_set_header Upgrade \$http_upgrade;
              proxy_set_header Connection "upgrade";
              proxy_set_header Host \$host;
              proxy_cache_bypass \$http_upgrade;
          }
      }
      NGINX_CONF
      EOF
      ,
      "sudo systemctl enable nginx",
      "sudo systemctl restart nginx"
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