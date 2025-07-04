# JijiFresh WhatsApp Bot

A powerful WhatsApp bot that enables buying and selling through WhatsApp messages, integrated with Web3 smart contracts.

## 🚀 Features

### For Sellers
- **Quick Listing**: `sell tomatoes 500 uyo`
- **Photo Uploads**: Send photos with descriptions
- **Inventory Management**: View, edit, delete listings
- **Sales Notifications**: Real-time buyer alerts

### For Buyers  
- **Smart Search**: `find rice uyo`
- **Instant Purchase**: `buy JF1234567890`
- **Bargaining**: `offer JF1234567890 400`
- **Secure Payments**: Escrow protection

### For Onboarders
- **Earn JijiPoints**: Onboard sellers and earn rewards
- **Track Performance**: Monitor earnings and stats
- **Monthly Payouts**: Get paid in USDT

## 📱 Bot Commands

### Registration
```
Hi JijiFresh
```

### Selling
```
sell tomatoes 500 uyo
my shop
edit JF1234567890
delete JF1234567890
```

### Buying
```
find rice uyo
buy JF1234567890
offer JF1234567890 400
```

### Onboarding
```
onboard seller
my stats
```

### General
```
help
commands
```

## 🛠 Setup Instructions

### Prerequisites
- Node.js 16+
- WhatsApp account
- Chrome/Chromium browser

### Installation

1. **Clone and Install**
```bash
cd server/whatsapp-bot
npm install
```

2. **Start the Bot**
```bash
npm start
```

3. **Scan QR Code**
- Open WhatsApp on your phone
- Go to Settings > Linked Devices
- Scan the QR code in terminal

4. **Test the Bot**
- Send "Hi JijiFresh" to your WhatsApp number
- Follow the registration flow

## 🔧 Configuration

### Environment Variables
```bash
# .env file
PORT=3001
WEBHOOK_URL=https://your-domain.com/webhook
SMART_CONTRACT_ADDRESS=0x...
LISK_RPC_URL=https://rpc.api.lisk.com
ADMIN_PHONE=+2348123456789
```

### Smart Contract Integration
```javascript
// In production, connect to Lisk blockchain
const contract = new ethers.Contract(
  process.env.SMART_CONTRACT_ADDRESS,
  contractABI,
  provider
);
```

## 📊 API Endpoints

### Get Listings
```
GET /api/listings
```

### Get Users
```
GET /api/users  
```

### Get Onboarders
```
GET /api/onboarders
```

### Send Message
```
POST /api/send-message
{
  "phone": "+2348123456789",
  "message": "Hello from JijiFresh!"
}
```

## 🎯 Onboarding Program

### Point System
- **Seller Signup**: 10 points
- **First Listing**: 15 points  
- **First Sale**: 25 points
- **30-day Active**: 50 points

### Payouts
- **1000+ points**: $50 USDT
- **500-999 points**: $25 USDT
- **100-499 points**: $10 USDT

### Bonus Multipliers
- **Rural areas**: 2x points
- **Elderly sellers (50+)**: 1.5x points
- **Bulk onboarding (5+)**: 1.3x points

## 🔐 Security Features

- **Phone Verification**: All users verified via WhatsApp
- **Escrow Payments**: Secure transaction handling
- **Anti-Spam**: Rate limiting and validation
- **Data Privacy**: Minimal data collection

## 🌍 Localization

### Supported Languages
- **English**: Default
- **Pidgin English**: Auto-detected
- **Yoruba**: Coming soon
- **Igbo**: Coming soon
- **Hausa**: Coming soon

### Example Pidgin Responses
```
"Haba nau, this price never reach reach!"
"Add am small thing nau, customer!"
"Boss, make we meet halfway na!"
```

## 📈 Analytics

### Tracked Metrics
- Daily active users
- Listings created
- Successful transactions
- Onboarding conversions
- Geographic distribution

### Dashboard Integration
- Real-time bot statistics
- User engagement metrics
- Revenue tracking
- Onboarder performance

## 🚀 Deployment

### Production Setup
```bash
# Install PM2 for process management
npm install -g pm2

# Start bot with PM2
pm2 start bot.js --name "jijifresh-bot"

# Monitor logs
pm2 logs jijifresh-bot
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 🔄 Integration with Web Dashboard

The bot automatically syncs with your web dashboard:

1. **New listings** appear on website
2. **User registrations** sync to database  
3. **Transactions** tracked in admin panel
4. **Onboarder stats** updated in real-time

## 📞 Support

For technical support:
- **Admin WhatsApp**: +234 XXX XXX XXXX
- **Email**: support@jijifresh.com
- **Documentation**: https://docs.jijifresh.com

## 🎉 Success Stories

> "I sold 50kg of rice in 2 hours using the WhatsApp bot!" 
> - Mama Ngozi, Uyo

> "Earned $75 last month just onboarding sellers!"
> - David, Community Onboarder

---

**Ready to revolutionize Nigerian commerce? Start your JijiFresh WhatsApp bot today!** 🌱🚀