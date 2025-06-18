provider "aws" {
  region = "us-east-1"
}

variable "public_key" {
  description = "SSH public key for EC2 access"
  type        = string
}

variable "domain_name" {
  description = "Domain name"
  type        = string
  default     = "raicesnuevaesperanza.me"
}

resource "aws_key_pair" "nodejs_ssh" {
  key_name   = "nodejs-ssh"
  public_key = var.public_key
}

resource "aws_security_group" "nodejs_sg" {
  name        = "backend-security-group"
  description = "SG for Node.js backend with Cloudflare"

  ingress {
    description = "Allow SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow HTTP for Cloudflare"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow HTTPS for Cloudflare"
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
      "sudo yum install -y git nginx",
      
      # Instalar Node.js 20
      "curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -",
      "sudo yum install -y nodejs",
      
      # Verificar instalación
      "node --version",
      "npm --version",
      
      # Clonar repositorio
      "git clone https://github.com/Khenya/venta-de-bienes-ra-ces-caso-Raices-Backend /home/ec2-user/app",
      
      # Instalar dependencias
      "cd /home/ec2-user/app && npm install --only=production",
      
      # Configurar Nginx para Cloudflare
      <<-EOF
      sudo tee /etc/nginx/conf.d/backend.conf > /dev/null <<'NGINX_CONF'
      server {
          listen 80;
          server_name ${var.domain_name} www.${var.domain_name};
          
          # Trust Cloudflare IPs
          set_real_ip_from 173.245.48.0/20;
          set_real_ip_from 103.21.244.0/22;
          set_real_ip_from 103.22.200.0/22;
          set_real_ip_from 103.31.4.0/22;
          set_real_ip_from 141.101.64.0/18;
          set_real_ip_from 108.162.192.0/18;
          set_real_ip_from 190.93.240.0/20;
          set_real_ip_from 188.114.96.0/20;
          set_real_ip_from 197.234.240.0/22;
          set_real_ip_from 198.41.128.0/17;
          set_real_ip_from 162.158.0.0/15;
          set_real_ip_from 104.16.0.0/13;
          set_real_ip_from 104.24.0.0/14;
          set_real_ip_from 172.64.0.0/13;
          set_real_ip_from 131.0.72.0/22;
          real_ip_header CF-Connecting-IP;
          
          location / {
              proxy_pass http://127.0.0.1:3000;
              proxy_http_version 1.1;
              proxy_set_header Upgrade $http_upgrade;
              proxy_set_header Connection 'upgrade';
              proxy_set_header Host $host;
              proxy_set_header X-Real-IP $remote_addr;
              proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
              proxy_set_header X-Forwarded-Proto $scheme;
              proxy_cache_bypass $http_upgrade;
              proxy_read_timeout 300s;
              proxy_connect_timeout 75s;
          }
          
          location /health {
              return 200 'OK - Backend Server Running';
              add_header Content-Type text/plain;
          }
      }
      NGINX_CONF
      EOF
      ,
      
      # Remover configuración default
      "sudo rm -f /etc/nginx/conf.d/default.conf",
      "sudo rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true",
      
      # Configurar y iniciar Nginx
      "sudo systemctl start nginx",
      "sudo systemctl enable nginx",
      
      # Validar configuración de Nginx
      "sudo nginx -t",
      
      # Crear archivo de log para la aplicación
      "touch /home/ec2-user/app.log",
      
      # Iniciar aplicación Node.js
      "cd /home/ec2-user/app && nohup npm start > /home/ec2-user/app.log 2>&1 &",
      
      # Esperar a que inicie
      "sleep 10",
      
      # Verificar que la aplicación esté corriendo
      "curl -f http://localhost:3000/health || curl -f http://localhost:3000 || echo 'Aplicación iniciando...'",
      
      # Mostrar status de servicios
      "sudo systemctl status nginx --no-pager",
      "ps aux | grep node | grep -v grep || echo 'Proceso Node.js no encontrado - revisar logs'"
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
  description = "IP elástica para configurar en Cloudflare DNS"
}

output "application_url_direct" {
  value = "http://${aws_eip.nodejs_eip.public_ip}"
  description = "URL directa para probar el servidor (antes de DNS)"
}

output "application_url_domain" {
  value = "https://${var.domain_name}"
  description = "URL final con dominio (después de configurar DNS)"
}

output "ssh_command" {
  value = "ssh -i id_rsa ec2-user@${aws_eip.nodejs_eip.public_ip}"
  description = "Comando para conectarse por SSH"
}