provider "aws" {
  region = "us-east-1"
}

variable "public_key" {
  description = "SSH public key for EC2 access"
  type        = string
}

variable "domain_name" {
  description = "Domain name for SSL certificate"
  type        = string
  default     = "raicesnuevaesperanza.me"
}

variable "email" {
  description = "Email for Let's Encrypt certificate"
  type        = string
  default     = "brendachoque1@gmail.com"
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

  ingress {
    description = "Backend internal port"
    from_port   = 3000
    to_port     = 3000
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

resource "aws_eip" "nodejs_eip" {
  domain = "vpc"
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
      "sudo yum install -y git nginx openssl epel-release",
      
      "curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -",
      "sudo yum install -y nodejs",
      "git clone https://github.com/Khenya/venta-de-bienes-ra-ces-caso-Raices-Backend /home/ec2-user/app",
      "cd /home/ec2-user/app && npm install --only=production",
      
      <<-EOF
      sudo tee /etc/nginx/conf.d/temp.conf > /dev/null <<NGINX_TEMP
      server {
          listen 80;
          server_name ${var.domain_name};
          
          location /.well-known/acme-challenge/ {
              root /var/www/html;
          }
          
          location / {
              return 200 'OK - Server ready for SSL';
              add_header Content-Type text/plain;
          }
      }
      NGINX_TEMP
      EOF
      ,
    
      "sudo systemctl start nginx",
      "sudo systemctl enable nginx",
      
      "sleep 10",
      
      "sudo yum install -y certbot python3-certbot-nginx",
      
      "echo 'Verificando DNS...'",
      "nslookup ${var.domain_name} || echo 'DNS aún no propagado'",
      
      "for i in {1..30}; do if curl -s http://${var.domain_name} > /dev/null; then echo 'Dominio accesible'; break; else echo 'Esperando DNS... intento $i/30'; sleep 10; fi; done",
      
      "sudo certbot --nginx -n --agree-tos --redirect --email ${var.email} -d ${var.domain_name}",
      
      <<-EOF
      sudo tee /etc/nginx/conf.d/backend.conf > /dev/null <<NGINX_CONF
      server {
          listen 80;
          server_name ${var.domain_name};
          return 301 https://\$server_name\$request_uri;
      }

      server {
          listen 443 ssl http2;
          server_name ${var.domain_name};
          
          ssl_certificate /etc/letsencrypt/live/${var.domain_name}/fullchain.pem;
          ssl_certificate_key /etc/letsencrypt/live/${var.domain_name}/privkey.pem;
          ssl_protocols TLSv1.2 TLSv1.3;
          ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
          ssl_prefer_server_ciphers off;
          
          location / {
              proxy_pass http://127.0.0.1:3000;
              proxy_http_version 1.1;
              proxy_set_header Upgrade \$http_upgrade;
              proxy_set_header Connection 'upgrade';
              proxy_set_header Host \$host;
              proxy_set_header X-Real-IP \$remote_addr;
              proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
              proxy_set_header X-Forwarded-Proto \$scheme;
              proxy_cache_bypass \$http_upgrade;
          }
      }
      NGINX_CONF
      EOF
      ,
      
      "sudo rm -f /etc/nginx/conf.d/temp.conf",
      
      "sudo nginx -t && sudo systemctl reload nginx",
      
      "cd /home/ec2-user/app && nohup npm start > /home/ec2-user/app.log 2>&1 &",
      
      "sudo mkdir -p /etc/cron.d",
      "echo '0 2 * * * root certbot renew --quiet --post-hook \"systemctl reload nginx\"' | sudo tee /etc/cron.d/certbot-renew"
    ]
  }

  depends_on = [aws_key_pair.nodejs_ssh, aws_eip.nodejs_eip]
}

resource "aws_eip_association" "eip_assoc" {
  instance_id   = aws_instance.nodejs_server.id
  allocation_id = aws_eip.nodejs_eip.id
}

output "ec2_public_ip" {
  value = aws_eip.nodejs_eip.public_ip
}

output "application_url_https" {
  value = "https://${var.domain_name}"
}

output "dns_instructions" {
  value = "Asegúrate de que tu dominio ${var.domain_name} apunte a la IP: ${aws_eip.nodejs_eip.public_ip}"
}