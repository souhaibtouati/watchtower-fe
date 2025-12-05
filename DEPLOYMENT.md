# Watchtower Frontend Deployment Guide

## Docker Hub Image

The image is available on Docker Hub: **[souhaibtouati/watchtower-fe](https://hub.docker.com/r/souhaibtouati/watchtower-fe)**

## Quick Deployment with Docker

### Prerequisites on Debian Server
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Log out and back in for group changes to take effect
# Then install Docker Compose
sudo apt-get update
sudo apt-get install -y docker-compose-plugin
```

### Deployment Steps

#### Option 1: Docker Run (Quickest)
```bash
docker run -d \
  --name watchtower-fe \
  -p 3000:80 \
  -e API_URL=http://your-api-host:8080 \
  --restart unless-stopped \
  souhaibtouati/watchtower-fe:latest
```

#### Option 2: Docker Compose (Recommended)
```bash
mkdir -p /opt/watchtower-fe && cd /opt/watchtower-fe

# Download docker-compose.yml
curl -fsSL https://raw.githubusercontent.com/souhaibtouati/watchtower-fe/main/docker-compose.yml -o docker-compose.yml

# Edit environment variables
nano docker-compose.yml

# Start the container
docker compose up -d
```

#### Option 3: Git Clone & Build
```bash
cd /opt
sudo git clone https://github.com/souhaibtouati/watchtower-fe.git
sudo chown -R $USER:$USER watchtower-fe
cd watchtower-fe
npm install
npm run build
docker compose up -d --build
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `API_URL` | `http://watchtower-api:8080` | Backend Watchtower API URL |
| `API_TIMEOUT` | `60s` | API request timeout |

### Configuration Examples

#### Docker Compose with environment variables:
```yaml
services:
  watchtower-fe:
    image: souhaibtouati/watchtower-fe:latest
    ports:
      - "3000:80"
    environment:
      - API_URL=http://192.168.1.100:8080
      - API_TIMEOUT=120s
```

#### Using .env file:
```bash
# Create .env file
cat > .env << EOF
API_URL=http://my-backend:8080
API_TIMEOUT=60s
EOF

# Run with env file
docker compose --env-file .env up -d
```

#### Docker run with environment variables:
```bash
docker run -d \
  --name watchtower-fe \
  -p 3000:80 \
  -e API_URL=http://192.168.1.100:8080 \
  -e API_TIMEOUT=120s \
  souhaibtouati/watchtower-fe:latest
```

### Change the Port
Edit `docker-compose.yml` and change the port mapping:
```yaml
ports:
  - "8080:80"  # Change 8080 to your desired port
```

### Useful Commands

```bash
# View logs
docker compose logs -f watchtower-fe

# Restart the service
docker compose restart

# Stop the service
docker compose down

# Rebuild after changes
docker compose up -d --build

# Check container status
docker compose ps
```

### Using with Nginx Reverse Proxy (Optional)

If you want to use a domain name with SSL, install Nginx on the host:

```bash
sudo apt install nginx certbot python3-certbot-nginx
```

Create `/etc/nginx/sites-available/watchtower`:
```nginx
server {
    listen 80;
    server_name watchtower.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site and get SSL certificate:
```bash
sudo ln -s /etc/nginx/sites-available/watchtower /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d watchtower.yourdomain.com
```

### Troubleshooting

**Container won't start:**
```bash
docker compose logs watchtower-fe
```

**Port already in use:**
```bash
sudo lsof -i :3000
# Change the port in docker-compose.yml
```

**Permission denied:**
```bash
sudo chown -R $USER:$USER /opt/watchtower-fe
```
