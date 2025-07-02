# Backend Personal Project - Production Setup Guide (Docker)

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [System Requirements](#system-requirements)
- [Project Setup](#project-setup)
- [Docker Image Management](#docker-image-management)
- [Container Deployment](#container-deployment)
- [Docker Compose Setup](#docker-compose-setup)
- [Environment Configuration](#environment-configuration)
- [Production Best Practices](#production-best-practices)
- [Monitoring & Logging](#monitoring--logging)
- [Troubleshooting](#troubleshooting)
- [Maintenance & Updates](#maintenance--updates)

## 🔧 Prerequisites

### Required Software
- **Docker Engine** (v20.10 or higher) - [Installation Guide](https://docs.docker.com/engine/install/)
- **Docker Compose** (v2.0 or higher) - Usually included with Docker Desktop
- **Git** - For repository management
- **Database Server** (MySQL/PostgreSQL) - Can be containerized or external

### System Verification
Verify your system meets the requirements:

```bash
# Check Docker version
docker --version
docker-compose --version

# Test Docker installation
docker run hello-world

# Check system resources
docker system df
docker system info
```

## 🖥️ System Requirements

### Minimum Requirements
- **CPU**: 2 cores
- **RAM**: 2GB available memory
- **Storage**: 10GB free disk space
- **Network**: Stable internet connection for image pulls

### Recommended for Production
- **CPU**: 4+ cores
- **RAM**: 4GB+ available memory
- **Storage**: 50GB+ free disk space (for logs, backups, etc.)
- **Network**: High-bandwidth connection
- **OS**: Linux (Ubuntu 20.04+, CentOS 8+, RHEL 8+)

## 🚀 Project Setup

### 1. Clone Repository

Download the project source code:

```bash
# Clone the repository
git clone https://github.com/yudhaginongpratidina/be-personal.git

# Navigate to project directory
cd be-personal

# Check current branch (ensure you're on main/master)
git branch
```

### 2. Prepare Production Files

Create necessary configuration files:

```bash
# Create production environment file
cp .env.example .env.production

# Create Docker-specific directories
mkdir -p logs
mkdir -p data/backups

# Set proper permissions
chmod 755 logs
chmod 755 data
```

## 🐳 Docker Image Management

### 1. Build Production Image

Build the Docker image with production optimizations:

```bash
# Build image with latest tag
docker build -t express/be-personal:latest .

# Build with version tag (recommended for production)
docker build -t express/be-personal:v1.0.0 .

# Build with build arguments (if needed)
docker build \
  --build-arg NODE_ENV=production \
  --build-arg BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ') \
  -t express/be-personal:latest .
```

### 2. Image Verification

Verify the built image:

```bash
# List Docker images
docker images express/be-personal

# Inspect image details
docker inspect express/be-personal:latest

# Check image size and layers
docker history express/be-personal:latest
```

## 🏃‍♂️ Container Deployment

### 1. Direct Docker Run

For simple deployments:

```bash
# Basic container run
docker run -d \
  --name be-personal \
  --restart unless-stopped \
  -p 4010:4010 \
  express/be-personal:latest

# Advanced container run with environment variables
docker run -d \
  --name be-personal \
  --restart unless-stopped \
  -p 4010:4010 \
  -v $(pwd)/logs:/var/log/myapp \
  -v $(pwd)/data:/app/data \
  -e HOSTNAME=0.0.0.0 \
  -e PORT=4010 \
  -e CORS_ORIGIN=https://yourdomain.com \
  -e DOMAIN=yourdomain.com \
  -e NODE_ENV=production \
  -e LOG_LEVEL=warn \
  -e LOG_DIR=/var/log/myapp \
  -e MAX_LOG_SIZE=20m \
  -e MAX_FILES=14d \
  -e DATABASE_URL=<db_dialect>://<db_username>:<db_password>@<db_host>:<db_port>/<db_name> \
  -e JWT_ACCESS_TOKEN_SECRET=your_generated_64_char_access_token_secret_here \
  -e JWT_REFRESH_TOKEN_SECRET=your_generated_64_char_refresh_token_secret_here \
  -e JWT_ISSUER=backend-personal \
  -e JWT_AUDIENCE=production-users \
  -e TZ=Asia/Jakarta \
  express/be-personal:latest
```

### 2. Container Management Commands

```bash
# Check container status
docker ps -a

# View container logs
docker logs be-personal
docker logs -f be-personal  # Follow logs

# Execute commands in running container
docker exec -it <container_id> sh

# Stop and start container
docker stop be-personal
docker start be-personal

# Remove container
docker rm be-personal
```

## ⚙️ Environment Configuration

### Production Environment Variables

| Variable | Production Value | Description | Security Level |
|----------|------------------|-------------|----------------|
| `HOSTNAME` | `0.0.0.0` | Bind to all interfaces | Medium |
| `PORT` | `4010` | Internal container port | Low |
| `CORS_ORIGIN` | `https://yourdomain.com` | Production frontend URL | Medium |
| `NODE_ENV` | `production` | Production mode | Low |
| `LOG_LEVEL` | `warn` or `error` | Reduce log verbosity | Low |
| `DATABASE_URL` | `mysql://user:pass@host:port/db` | Database connection | High |
| `JWT_ACCESS_TOKEN_SECRET` | 64+ char random string | Token security | Critical |
| `JWT_REFRESH_TOKEN_SECRET` | 64+ char random string | Token security | Critical |

### Security Best Practices for Environment Variables

```bash
# Generate secure JWT secrets
node -e "console.log('ACCESS_TOKEN_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"
node -e "console.log('REFRESH_TOKEN_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"
