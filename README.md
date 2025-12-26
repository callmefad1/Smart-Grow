# Smart Grow User Dashboard - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
cd user
npm install

### 3. Start Development Server
```bash
npm start
```

The app will open at `http://localhost:3000`

---

## 📖 User Guide

### First Time Login
1. Click "Sign Up" on the login page
2. Enter your email and password
3. Click "Sign Up" to create account
4. You'll be redirected to Dashboard (Basic plan by default)

### Navigation
- **Dashboard**: View real-time sensor data
- **Farm Zones**: Manage your farm locations
- **Vans**: Control water distribution vans
- **Subscription**: View/upgrade your plan

### Dashboard Usage
- **Weather**: See weekly forecast
- **Water Level**: Monitor well/container levels
- **Soil Data**: Check temperature and humidity
- **Battery**: Track sensor battery status

### Managing Farm Zones
1. Click "Add New Zone"
2. Fill in zone details (name, location, area, crop type)
3. Select soil type from dropdown
4. Add optional description
5. Click "Create Zone"

To edit: Click the edit icon on a zone card
To delete: Click the trash icon (confirmation required)

### Controlling Water Vans
1. Click "Add Van" to register a new van
2. Enter van details (name, model, capacity)
3. Use the Power button to activate/deactivate
4. Set schedule time using the time input
5. Set timer (in minutes) for auto-watering

To request a new van:
1. Click "Request New Van"
2. Select van type and quantity
3. Explain your need
4. Submit to admin

### Subscription Plans
1. Go to "Subscription" page
2. Compare the three plans
3. Click "Upgrade" on desired plan
4. Confirm the upgrade
5. Your plan changes immediately

**Note**: Basic plan only allows Dashboard access. Upgrade to access other features.

---

## 🔑 Demo Credentials

For testing, you can use any email/password combination. Firebase will create an account automatically.

Example:
- Email: `test@example.com`
- Password: `Test@123`

---

## 📋 Subscription Features Unlocked

### Basic (FREE)
✅ Dashboard
✅ Sensor monitoring
✅ Weather data
❌ Farm Zones (disabled)
❌ Water Vans (disabled)
❌ Live Chat
❌ AI Assistant

### Moderate (55 DT/Month)
✅ Dashboard
✅ Sensor monitoring
✅ Weather data
✅ Farm Zones
✅ Water Vans
❌ Live Chat
❌ AI Assistant

### Premium (660 DT/Year)
✅ All features
✅ Live Chat
✅ AI Assistant
✅ Priority support

---

## 🎨 Theme Toggle
Click the sun/moon icon in the top-right corner to switch between light and dark modes.

---

## 👤 User Profile
Click your avatar in the top-right to:
- View your email
- Logout

---

## ⚠️ Important Notes

1. **Real-time Updates**: All data updates in real-time from Firebase
2. **Auto-save**: Forms auto-save to database when submitted
3. **Responsive Design**: Works perfectly on mobile, tablet, and desktop
4. **Connection Status**: Check the connection indicator in dashboard header
5. **Error Messages**: Red alerts show any issues - read them carefully

---

## 🔍 Troubleshooting

### Can't Login?
- Check Firebase credentials in `.env` file
- Ensure Firebase Realtime Database is enabled
- Try signing up with a new account

### Farm Zones Not Showing?
- Make sure you're on Moderate or Premium plan
- Check Firebase database permissions
- Wait a moment for real-time sync

### Vans Control Not Working?
- Confirm subscription tier (Moderate+ required)
- Check van status is not "Maintenance"
- Verify Firebase database connectivity

### Buttons Disabled?
- You're on Basic plan - upgrade to access features
- Go to Subscription page to upgrade

---

## 💡 Tips & Tricks

1. **Bulk Operations**: You can quickly toggle multiple vans on/off
2. **Schedule Ahead**: Set schedules for vans days in advance
3. **Monitor Battery**: Replace sensor batteries when below 25%
4. **Zone Organization**: Use descriptive names for easy identification
5. **Dark Mode**: Use dark mode in low-light conditions for eye comfort

---

## 🆘 Getting Help

### Check FAQ
- Visit Subscription page > FAQ section
- Many common questions answered there

### Monitor Status
- Check the "Connected" status in Dashboard header
- Verify internet connection if offline

### Review Errors
- Read error messages carefully - they're descriptive
- Check console for detailed error logs (F12)

---

## 📱 Mobile Experience

The dashboard is fully optimized for mobile:
- Hamburger menu on small screens
- Touch-friendly buttons and inputs
- Responsive grid layouts
- Works in portrait and landscape
- Smooth gestures and animations

---

## 🔐 Security & Privacy

- Your data is stored securely in Firebase
- All data is encrypted in transit
- Passwords are hashed by Firebase Auth
- You can logout anytime to end your session
- Delete your account settings (if available in admin panel)

---

## 🚀 Production Deployment

When ready to deploy:

1. **Build the app**
   ```bash
   npm run build
   ```

2. **Deploy to Firebase Hosting** (recommended)
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase deploy
   ```

3. **Or deploy to your server**
   - Upload `build/` folder contents
   - Configure web server for SPA routing

---

## 📞 Support

For detailed documentation, see:
- `README.md` - Full feature documentation
- `IMPLEMENTATION_SUMMARY.md` - Technical overview
- Code comments in component files

---

**Enjoy managing your farm with Smart Grow! 🌾**
