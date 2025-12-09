# UptoCode Website

## Setup

1. Configure environment variables in `.env`:
```bash
SMTP_HOST=mail.uptocode.co.za
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=info@uptocode.co.za
SMTP_PASS=your_password
SMTP_FROM=info@uptocode.co.za
SMTP_TO=jason@uptocode.co.za
```

2. Install dependencies:
```bash
npm install
```

3. Build and run:
```bash
npm run build
npm start
```

## Docker Deployment

```bash
# Build and push
./deploy.sh

# On Docker host
docker pull reg.shtf.co.za/uptocode-website:latest
docker run -d --name uptocode-website --restart unless-stopped -p 3000:3000 --env-file .env reg.shtf.co.za/uptocode-website:latest
```
