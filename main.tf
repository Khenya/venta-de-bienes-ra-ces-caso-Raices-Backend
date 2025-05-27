provider "aws" {
  region = "us-east-1"
}

# Security Group
resource "aws_security_group" "nodejs_sg" {
  name        = "nodejs-security-group"
  description = "Security group con puerto 8000 abierto para Node.js"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] 
  }

  ingress {
    description = "Allow HTTP on port 8000"
    from_port   = 8000
    to_port     = 8000
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

# Key Pair
resource "aws_key_pair" "nodejs-ssh" {
  key_name   = "nodejs-ssh"
  public_key = file("id_rsa.pub")
}

# EC2 Instance
resource "aws_instance" "nodejs_server" {
  ami           = "ami-01816d07b1128cd2d" # Amazon Linux 2
  instance_type = "t2.micro"
  key_name      = aws_key_pair.nodejs-ssh.key_name
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
      private_key = file("id_rsa")
    }

    inline = [
      "sudo yum update -y",
      "sudo yum install -y git",
      "curl -fsSL https://rpm.nodesource.com/setup_16.x | sudo bash -",
      "sudo yum install -y nodejs",
      "git clone https://github.com/Khenya/ISC-System-UPB-Core.git /home/ec2-user/app",
      "cd /home/ec2-user/app",
      "npm install",
      "echo '#!/bin/bash' > /home/ec2-user/start_app.sh",
      "echo 'cd /home/ec2-user/app' >> /home/ec2-user/start_app.sh",
      "echo 'nohup npm start > app.log 2>&1 &' >> /home/ec2-user/start_app.sh",
      "chmod +x /home/ec2-user/start_app.sh",
      "sudo -u ec2-user bash /home/ec2-user/start_app.sh"
    ]
  }
}

# Elastic IP
resource "aws_eip" "nodejs_eip" {
  vpc = true
}

resource "aws_eip_association" "nodejs_eip_association" {
  instance_id   = aws_instance.nodejs_server.id
  allocation_id = aws_eip.nodejs_eip.id
}