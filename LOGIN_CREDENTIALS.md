# Login Credentials Guide

## 🔐 Hybrid Authentication System

Your application now supports **three different ways** to log in:

### 1️⃣ Default Admin Account (Pre-configured)
**Username:** `admin123` or `admin`  
**Password:** `admin123`  
**Email:** `admin@adharshgram.in`

- ✅ Automatically created on first app load
- ✅ Can login with username OR email
- ✅ Full admin privileges

### 2️⃣ Username Login (For Registered Users)
Once users register, they can log in using their **username** instead of email:

**Example:**
- Registered with email: `john@example.com`
- Chose username: `john123`
- Can login with: `john123` + password

### 3️⃣ Email Login (Standard Firebase)
Users can always log in with their **email address**:

**Example:**
- Email: `user@example.com`
- Password: `userpassword`

---

## 🎯 How It Works

### Username to Email Mapping
When a user registers:
1. Their username and email are stored in `localStorage` under `users` key
2. At login, if no `@` symbol is detected, the system looks up the email from the username
3. Firebase authentication proceeds with the email

### Default Admin Auto-Creation
On first app load:
1. System checks if admin is initialized
2. Creates Firebase account: `admin@adharshgram.in` with password `admin123`
3. Stores admin data in `users` list
4. Marks admin as initialized

### Login Flow
```
User enters: "admin123" + "admin123"
    ↓
System detects no "@" symbol (it's a username)
    ↓
Looks up username in localStorage users list
    ↓
Finds email: "admin@adharshgram.in"
    ↓
Authenticates with Firebase using email
    ↓
Success! User logged in
```

---

## 📝 Registration Requirements

When creating a new account:
- ✅ **Email**: Must be valid and unique
- ✅ **Username**: Must be unique (checked against existing users)
- ✅ **Password**: Minimum 6 characters (Firebase requirement)
- ✅ **Username Format**: Can be anything (letters, numbers, underscores)

---

## 🧪 Testing All Methods

### Test Admin Login (Username)
```
Username/Email: admin123
Password: admin123
```

### Test Admin Login (Email)
```
Username/Email: admin@adharshgram.in
Password: admin123
```

### Test New User Registration
1. Go to `/register`
2. Enter:
   - Email: `testuser@example.com`
   - Password: `test123`
   - Username: `testuser`
3. Register
4. Logout
5. Login with username: `testuser` and password: `test123`
6. OR login with email: `testuser@example.com` and password: `test123`

---

## 🔧 Technical Details

### Data Storage
**localStorage Keys:**
- `users` - Array of all registered users with username-email mappings
- `user` - Current logged-in user data
- `adminInitialized` - Flag to prevent duplicate admin creation
- `hasSeenTour` - Whether user has seen the welcome tour

**User Object Structure:**
```json
{
  "email": "user@example.com",
  "username": "username123",
  "role": "District Admin",
  "name": "Display Name"
}
```

### Firebase Integration
- Uses Firebase Authentication for security
- Email/password authentication method
- Password reset via email
- Session persistence across browser refreshes

---

## ⚠️ Important Notes

1. **Username Uniqueness**: Usernames are checked only in localStorage, not at Firebase level
2. **Case Sensitivity**: Usernames are case-sensitive
3. **Admin Password**: Change the default admin password in production!
4. **Email Required**: Firebase requires email for all accounts
5. **Username Fallback**: If username lookup fails, system treats input as email

---

## 🚀 Quick Start

**For Admins:**
```
Username: admin123
Password: admin123
```

**For New Users:**
1. Click "Create Account"
2. Fill in email, username, password
3. Login with either username or email

---

## 🔒 Security Recommendations

For production deployment:
- [ ] Change default admin password
- [ ] Add password complexity requirements
- [ ] Implement rate limiting for login attempts
- [ ] Add email verification for new accounts
- [ ] Store username mappings in Firebase database instead of localStorage
- [ ] Add admin panel to manage user accounts
- [ ] Implement role-based access control (RBAC)
