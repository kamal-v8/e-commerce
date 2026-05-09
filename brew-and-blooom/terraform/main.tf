# ────────────────────────────────────────────────
# VPC & Networking (secure baseline)
# ────────────────────────────────────────────────

resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = { Name = "learning-vpc" }
}

resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id
  tags   = { Name = "learning-igw" }
}

resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "us-east-1a"

  tags = { Name = "public-subnet" }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }

  tags = { Name = "public-rt" }
}

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

# ────────────────────────────────────────────────
# Security Groups
# ────────────────────────────────────────────────

resource "aws_security_group" "ec2_sg" {
  name        = "ec2-inbound"
  description = "allow http/s, ssh and app ports"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "SSH"
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTP"
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTPS"
  }

  ingress {
    from_port   = 4000
    to_port     = 4000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Grafana"
  }

  ingress {
    from_port   = 9000
    to_port     = 9000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Prometheus"
  }

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "cAdvisor"
  }


  ingress {
    from_port   = 61000
    to_port     = 61000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "mosh"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound"
  }

  tags = { Name = "ec2-sg" }
}

# ────────────────────────────────────────────────
# Key Pair
# ────────────────────────────────────────────────

resource "aws_key_pair" "deployer" {
  key_name   = "deployer-key"
  public_key = file("/home/kamal/.ssh/ec2-key.pub")
}

# ────────────────────────────────────────────────
# EC2 Instance
# ────────────────────────────────────────────────

resource "aws_instance" "learning" {
  ami                    = "ami-0ec10929233384c7f" # Ubuntu 24.04 us-east-1
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.ec2_sg.id]
  key_name               = aws_key_pair.deployer.key_name

  root_block_device {
    volume_size = 10
    volume_type = "gp3"
  }

  user_data_replace_on_change = true

  user_data = <<-EOF
#!/bin/bash
set -ex

# 1. Update and install basic dependencies
apt-get update -y
apt-get install -y mosh ca-certificates curl gnupg certbot git

# 2. Install Docker
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 3. Setup user permissions
usermod -aG docker ubuntu

# 4. Setup Project
cd /home/ubuntu
sudo -u ubuntu git clone https://github.com/kamal-v8/e-commerce.git
cd e-commerce/brew-and-blooom || cd e-commerce

# 5. Create .env Files
cat <<EOT > .env
DB_USER=db
DB_PASSWORD=db-pass
DB_NAME=db
JWT_SECRET=my-little-secret
EOT

mkdir -p backend
cat <<EOT > backend/.env
DB_PASSWORD=db-pass
DB_HOST=db
DB_NAME=db
PORT=3000
JWT_SECRET=my-little-secret
EOT

# 6. Fix Permissions & Start
chown -R ubuntu:ubuntu /home/ubuntu/e-commerce
if [ -f "docker-compose.yml" ]; then
  sudo -u ubuntu docker compose up -d
fi
EOF

  tags = { Name = "EC2-Learning" }
}

# ────────────────────────────────────────────────
# Elastic IP
# ────────────────────────────────────────────────

resource "aws_eip" "learning_eip" {
  domain = "vpc"
  tags   = { Name = "learning-eip" }
}

resource "aws_eip_association" "eip_assoc" {
  instance_id   = aws_instance.learning.id
  allocation_id = aws_eip.learning_eip.id
}
