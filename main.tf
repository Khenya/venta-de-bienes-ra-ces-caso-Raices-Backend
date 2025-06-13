provider "aws" {
  region = "us-east-1"
}

variable "public_key" {
  description = "SSH public key for EC2 access"
  type        = string
}

resource "aws_key_pair" "nodejs_ssh" {
  key_name   = "nodejs-ssh"
  public_key = var.public_key
}

resource "aws_security_group" "nodejs_sg" {
  name        = "backend-security-group"
  description = "SG for Node.js backend with HTTPS"

  ingress {
    description = "Allow SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow HTTP for LetsEncrypt"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow HTTPS traffic"
    from_port   = 443
    to_port     = 443
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

      "sudo yum install -y epel-release",
      "sudo yum install -y certbot python3-certbot-nginx",

      "sudo bash -c 'echo \"server { listen 80; server_name raicesnuevaesperanza.me; location / { return 200 OK; } }\" > /etc/nginx/conf.d/temp.conf'",
      "sudo systemctl restart nginx",

      "sudo certbot --nginx -n --agree-tos --redirect --email brendachoque1@gmail.com -d raicesnuevaesperanza.me",

      "echo \"0 0 * * * root certbot renew --post-hook 'systemctl reload nginx'\" | sudo tee /etc/cron.d/certbot-renew"
    ]
  }

  depends_on = [aws_key_pair.nodejs_ssh]
}

resource "aws_eip" "nodejs_eip" {
  domain = "vpc"
}

resource "aws_eip_association" "eip_assoc" {
  instance_id   = aws_instance.nodejs_server.id
  allocation_id = aws_eip.nodejs_eip.id
}

output "ec2_public_ip" {
  value = aws_instance.nodejs_server.public_ip
}

output "application_url_https" {
  value = "https://raicesnuevaesperanza.me"
}