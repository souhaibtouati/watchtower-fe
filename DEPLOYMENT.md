# Watchtower Frontend Deployment Guide

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

#### Option 1: One-Command Deployment (Recommended)

Run the deploy script directly on your server:
```bash
curl -fsSL https://raw.githubusercontent.com/souhaibtouati/watchtower-fe/main/deploy.sh | bash
```

Or download and run:
```bash
wget https://raw.githubusercontent.com/souhaibtouati/watchtower-fe/main/deploy.sh
chmod +x deploy.sh
./deploy.sh
```

#### Option 2: Manual Git Deployment

1. On your server:
```bash
cd /opt
sudo git clone https://github.com/souhaibtouati/watchtower-fe.git
sudo chown -R $USER:$USER watchtower-fe
cd watchtower-fe
npm install
npm run build
docker compose up -d --build
```

2. To update later:
```bash
cd /opt/watchtower-fe
git pull
npm install
npm run build
docker compose up -d --build
```

#### Option 3: Copy Files Directly (No git required)

1. **On your local machine**, copy the required files to your server:
```bash
# From the watchtower-fe directory
scp -r dist/ Dockerfile nginx.conf docker-compose.yml user@your-server:/opt/watchtower-fe/
```

2. **On your Debian server**:
```bash
cd /opt/watchtower-fe
docker compose up -d --build
```

3. The app is now available at `http://your-server:3000`

### Configuration

#### Change the port
Edit `docker-compose.yml` and change the port mapping:
```yaml
ports:
  - "8080:80"  # Change 8080 to your desired port
```

#### Connect to a backend API
Edit `nginx.conf` and update the proxy_pass URL:
```nginx
location /api {
    proxy_pass http://your-backend-host:8080;
    # ...
}
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
