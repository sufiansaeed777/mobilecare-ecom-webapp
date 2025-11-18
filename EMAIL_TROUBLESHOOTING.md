# Email Troubleshooting Guide for MobileCare

## Issue: Emails work locally but not on production server

### Quick Diagnosis Steps

1. **SSH into your production server:**
   ```bash
   ssh root@138.68.184.53
   ```

2. **Run the diagnostic script:**
   ```bash
   cd /path/to/your/app
   ./diagnose-email.sh
   ```

### Manual Troubleshooting Steps

#### 1. Find Your Application Directory
```bash
# Check common locations
ls -la /root/mern-website-sanjay
ls -la /home/daniel/mern-website-sanjay
find / -name "mern-website-sanjay" -type d 2>/dev/null
```

#### 2. Check if Backend is Running
```bash
# Check PM2
pm2 list

# Check for Node.js processes
ps aux | grep node

# Check if port 5001 is listening
netstat -tulpn | grep :5001
```

#### 3. Verify Environment Configuration
```bash
cd /your/app/backend
cat .env.production

# Ensure these are set:
# SMTP_HOST=mail.privateemail.com
# SMTP_PORT=587
# SMTP_USER=support@mobilecare.org.uk
# SMTP_PASS=your_password
```

#### 4. Test Email Configuration
```bash
cd /your/app
node test-email.js
```

#### 5. Start/Restart the Backend
```bash
cd /your/app
./start-backend.sh
```

### Common Issues and Solutions

#### Issue 1: Backend Not Running
**Symptoms:** Port 5001 not listening, no Node.js processes
**Solution:**
```bash
cd /your/app/backend
pm2 start server.js --name mobilecare-backend
```

#### Issue 2: Wrong Environment File
**Symptoms:** Backend running but using wrong configuration
**Solution:**
```bash
cd /your/app/backend
cp .env.production .env
pm2 restart mobilecare-backend
```

#### Issue 3: SMTP Authentication Failed
**Symptoms:** "Authentication failed" errors in logs
**Solutions:**
- Verify SMTP credentials are correct
- Check if email provider requires app-specific password
- Ensure 2FA is not blocking SMTP authentication

#### Issue 4: Firewall Blocking SMTP
**Symptoms:** "Connection timeout" errors
**Solution:**
```bash
# Check firewall rules
ufw status

# Allow outbound SMTP
ufw allow out 587/tcp
ufw allow out 465/tcp
```

#### Issue 5: Wrong SMTP Port/Security
**Symptoms:** Connection refused or SSL errors
**Solution:**
- Port 587: Use TLS (secure: false)
- Port 465: Use SSL (secure: true)
- Port 25: Usually blocked, not recommended

### Checking Logs

```bash
# PM2 logs
pm2 logs mobilecare-backend --lines 100

# Search for email errors
pm2 logs | grep -i "smtp\|email\|mail"

# System logs
journalctl -u node -n 100
```

### Testing Email Endpoints

```bash
# Test contact form
curl -X POST http://localhost:5001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "1234567890",
    "message": "Test message"
  }'

# Test booking confirmation
curl -X POST http://localhost:5001/api/send-confirmation-email \
  -H "Content-Type: application/json" \
  -d '{
    "bookingData": {
      "name": "Test User",
      "email": "test@example.com",
      "phone": "1234567890",
      "date": "2024-01-20",
      "time": "10:00 AM"
    },
    "cartItems": [],
    "totalPrice": 100
  }'
```

### Private Email (Namecheap) Specific Settings

If using Namecheap Private Email:
- **SMTP Host:** mail.privateemail.com
- **SMTP Port:** 587 (TLS) or 465 (SSL)
- **Authentication:** Full email address and password
- **Security:** STARTTLS for port 587

### Next Steps

1. Run the diagnostic script on your production server
2. Check if the backend is running on port 5001
3. Verify the .env file has correct SMTP settings
4. Test the SMTP connection using the test-email.js script
5. Check PM2 logs for specific error messages

If issues persist, please share:
- Output from the diagnostic script
- PM2 logs showing email errors
- The exact error messages users see