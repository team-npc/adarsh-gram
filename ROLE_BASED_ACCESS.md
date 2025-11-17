# Role-Based Access Control System

## Overview
The Adarsh Gram system now implements proper role-based access control. Users must select their role after login/registration, and admin access is restricted to authorized emails only.

## Available Roles

### 1. **Viewer** (Read-Only Access)
- **Access Level:** Basic
- **Permissions:**
  - View reports and assessments
  - View village information
  - View analytics dashboards
- **Restrictions:**
  - Cannot create or edit content
  - Cannot submit assessments
  - Cannot manage users

### 2. **Field Assessor**
- **Access Level:** Standard
- **Permissions:**
  - All Viewer permissions
  - Conduct village assessments
  - Submit assessment reports
  - Report problems
- **Restrictions:**
  - Cannot manage projects
  - Cannot access admin functions
  - Cannot manage users

### 3. **Project Coordinator**
- **Access Level:** Advanced
- **Permissions:**
  - All Field Assessor permissions
  - Create and manage projects
  - Track village development progress
  - Generate comprehensive reports
  - Assign tasks to field assessors
- **Restrictions:**
  - Cannot access admin functions
  - Cannot manage user accounts

### 4. **District Admin** (Restricted)
- **Access Level:** Full System Access
- **Permissions:**
  - All system permissions
  - User management
  - System configuration
  - Data export and backup
  - Analytics and reporting
  - Approve assessments
- **Restrictions:**
  - Only available to authorized email addresses

## Admin Authorization

### Authorized Admin Emails:
Only the following emails can select the "District Admin" role:
- `admin@adharshgram.in`
- `admin123@adharshgram.in`

To add more admin emails, update the `ADMIN_EMAILS` array in:
```typescript
frontend/src/context/AuthContext.tsx
```

### Adding New Admin Emails:
```typescript
const ADMIN_EMAILS = [
  'admin@adharshgram.in',
  'admin123@adharshgram.in',
  'newemail@example.com',  // Add new admin emails here
];
```

## User Flow

### For New Users:
1. **Register/Login** → User enters credentials
2. **Role Selection** → Modal appears with 4 role options
3. **Select Role** → User chooses appropriate role
4. **Access Dashboard** → User gains access based on selected role

### For Existing Users:
- Users with assigned roles login directly
- No role selection needed on subsequent logins
- Role is stored in localStorage and Firebase

### For Admin Users:
1. Must login with authorized email
2. Can select "District Admin" role
3. Non-authorized emails see "Admin Access Required" lock on admin role

## Default Admin Account

### Credentials:
- **Email:** admin@adharshgram.in
- **Username:** admin123
- **Password:** admin123
- **Role:** Admin (pre-assigned)

This account is automatically created on first app load and has full admin privileges.

## Security Features

### Role Protection:
✅ Admin role restricted to authorized emails  
✅ Unauthorized users see locked admin option  
✅ Alert shown if non-admin tries to assign admin role  
✅ Role assignment stored securely in localStorage  
✅ Firebase authentication validates all users

### Role Persistence:
- Role stored in `localStorage` under `users` array
- Each user object contains:
  ```json
  {
    "username": "john_doe",
    "email": "john@example.com",
    "role": "assessor",
    "roleAssigned": true
  }
  ```

## Technical Implementation

### Files Modified:
1. **AuthContext.tsx** - Added role assignment logic and admin email checking
2. **RoleSelection.tsx** - New component for role selection UI
3. **Layout.tsx** - Shows RoleSelection modal when `needsRoleAssignment` is true

### Key Functions:
- `assignRole(role: string)` - Assigns role to current user
- `needsRoleAssignment` - Boolean flag indicating if user needs to select role
- `ADMIN_EMAILS` - Array of authorized admin emails

## Future Enhancements

### Planned Features:
- [ ] Backend API integration for role management
- [ ] Role-based UI component visibility
- [ ] Permission-specific route guards
- [ ] Audit logging for admin actions
- [ ] Role change requests workflow
- [ ] Multi-level approval system

## Usage Examples

### Checking User Role in Components:
```typescript
import { useAuth } from '../../context/AuthContext';

const MyComponent = () => {
  const { user } = useAuth();
  
  if (user?.role === 'admin') {
    // Show admin-only features
  }
  
  if (user?.role === 'assessor' || user?.role === 'admin') {
    // Show assessor features
  }
  
  return <div>Content</div>;
};
```

### Protecting Routes:
```typescript
{user?.role === 'admin' && (
  <Route path="/admin" element={<AdminPanel />} />
)}
```

## Support

### Need Admin Access?
Contact your system administrator to add your email to the authorized list.

### Role Change Request:
Contact admin to request role changes for existing accounts.

### Issues?
Check console for error messages and verify:
1. Email is correctly spelled in ADMIN_EMAILS array
2. User has completed role selection
3. localStorage is not cleared after role assignment
