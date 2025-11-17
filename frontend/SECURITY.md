# Adarsh Gram Gap Assessment System - Security Configuration

## Environment Variables Setup

### Frontend Configuration

The admin credentials are stored securely in environment variables. Follow these steps:

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit the `.env` file and update the credentials:**
   ```env
   REACT_APP_ADMIN_USERNAME=your_admin_username
   REACT_APP_ADMIN_PASSWORD=your_secure_password
   ```

3. **Important Security Notes:**
   - ✅ The `.env` file is in `.gitignore` and will NOT be committed to version control
   - ✅ Never share your `.env` file or commit it to the repository
   - ✅ Use strong passwords in production
   - ✅ The `.env.example` file contains placeholder values only

### Current Configuration

The `.env` file contains:
- `REACT_APP_ADMIN_USERNAME` - Admin username for login
- `REACT_APP_ADMIN_PASSWORD` - Admin password for login
- `REACT_APP_API_URL` - Backend API URL
- `REACT_APP_NAME` - Application name
- `REACT_APP_VERSION` - Application version

### Production Deployment

For production environments:
1. Use environment variables from your hosting platform (Vercel, Netlify, etc.)
2. Never use default credentials like `admin123`
3. Implement proper backend authentication with JWT tokens
4. Use HTTPS for all communications
5. Consider implementing 2FA (Two-Factor Authentication)

### Backend Integration

In production, replace the frontend authentication logic with API calls:
```typescript
const login = async (username: string, password: string) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return response.json();
};
```

### Changing Credentials

To change admin credentials:
1. Edit the `.env` file
2. Restart the development server: `npm start`
3. Login with the new credentials

---

**⚠️ IMPORTANT:** Never expose credentials in code, screenshots, or documentation!
