provider "aws" {
  region = "us-east-1"
}

variable "public_key" {
  description = "SSH public key for EC2 access"
  type        = string
}

resource "aws_security_group" "nodejs_sg" {
  name        = "backend-security-group"
  description = "Security group for Node.js backend application"

  # Regla SSH
  ingress {
    description = "SSH access"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Regla HTTP (puerto 80)
  ingress {
    description = "HTTP access"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Regla para Node.js (puerto 3001)
  ingress {
    description = "Node.js App port"
    from_port   = 3001
    to_port     = 3001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Regla para puerto 8000
  ingress {
    description = "Alternative Node.js port"
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Regla de salida (egress) - permite todo el tráfico de salida
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_key_pair" "nodejs-ssh" {
  key_name   = "nodejs-ssh"
  public_key = var.public_key
}

resource "aws_instance" "nodejs_server" {
  ami                    = "ami-01816d07b1128cd2d"
  instance_type          = "t2.micro"
  key_name               = aws_key_pair.nodejs-ssh.key_name
  vpc_security_group_ids = [aws_security_group.nodejs_sg.id]

  tags = {
    Name = "NodeJS-App-Server"
  }

  depends_on = [aws_security_group.nodejs_sg]

  provisioner "remote-exec" {
    connection {
      type        = "ssh"
      host        = self.public_ip
      user        = "ec2-user"
      private_key = file("${path.module}/id_rsa")
    }

    inline = [
      "sudo yum update -y",
      "sudo yum install -y git",
      "curl -fsSL https://rpm.nodesource.com/setup_16.x | sudo bash -",
      "sudo yum install -y nodejs",
      "git clone https://github.com/Khenya/venta-de-bienes-ra-ces-caso-Raices-Backend /home/ec2-user/app",
      "cd /home/ec2-user/app",
      "npm install"
    ]
  }
}

resource "aws_eip" "nodejs_eip" {
  domain = "vpc"
}

resource "aws_eip_association" "nodejs_eip_association" {
  instance_id   = aws_instance.nodejs_server.id
  allocation_id = aws_eip.nodejs_eip.id
}

output "ec2_public_ip" {
  value = aws_instance.nodejs_server.public_ip
}

output "application_url" {
  value = "http://${aws_eip.nodejs_eip.public_ip}:3001"
}
