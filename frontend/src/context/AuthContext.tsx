import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth } from '../config/firebase';

interface User {
  username: string;
  email: string;
  role: string;
  roleAssigned?: boolean;
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, username: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  isFirstTimeUser: boolean;
  markTourComplete: () => void;
  assignRole: (role: string) => void;
  needsRoleAssignment: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  const [needsRoleAssignment, setNeedsRoleAssignment] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // List of authorized admin emails (useMemo to prevent re-creation on each render)
  const ADMIN_EMAILS = React.useMemo(() => [
    'admin@adharshgram.in',
    'admin123@adharshgram.in',
    'yakkalasunayana1605@gmail.com',
  ], []);

  useEffect(() => {
    // Set a timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      console.warn('Auth initialization timeout - setting loading to false');
      setLoading(false);
      
      // If Firebase hasn't initialized, try to load user from localStorage
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setNeedsRoleAssignment(!userData.roleAssigned);
        } catch (e) {
          console.error('Failed to parse saved user', e);
        }
      }
    }, 5000); // 5 second timeout
    
    // Initialize default admin account
    const initializeDefaultAdmin = () => {
      const adminInitialized = localStorage.getItem('adminInitialized');
      if (!adminInitialized) {
        const adminUser = {
          email: 'admin@adharshgram.in',
          username: 'admin123',
          role: 'admin',
          roleAssigned: true,
          name: 'System Administrator'
        };
        
        const usersData = localStorage.getItem('users');
        const users = usersData ? JSON.parse(usersData) : [];
        const adminExists = users.some((u: any) => u.email === 'admin@adharshgram.in');
        if (!adminExists) {
          users.push(adminUser);
          localStorage.setItem('users', JSON.stringify(users));
        } else {
          // Update existing admin to have roleAssigned
          const adminIndex = users.findIndex((u: any) => u.email === 'admin@adharshgram.in');
          if (adminIndex >= 0) {
            users[adminIndex] = { ...users[adminIndex], roleAssigned: true, role: 'admin' };
            localStorage.setItem('users', JSON.stringify(users));
          }
        }
        localStorage.setItem('adminInitialized', 'true');
      }
    };

    initializeDefaultAdmin();

    // Listen to Firebase auth state changes with error handling
    let unsubscribe: () => void;
    try {
      unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        clearTimeout(loadingTimeout);
        if (firebaseUser) {
          // Check if user has a role assigned
          const usersData = localStorage.getItem('users');
          let userData: User | null = null;
          
          // Check if this is an admin email
          const isAdminEmail = ADMIN_EMAILS.includes(firebaseUser.email || '');
          
          if (usersData) {
            const users = JSON.parse(usersData);
            const storedUser = users.find((u: any) => u.email === firebaseUser.email);
            if (storedUser && storedUser.roleAssigned) {
              userData = storedUser;
            } else if (isAdminEmail) {
              // Auto-assign admin role for authorized emails
              userData = {
                username: storedUser?.username || firebaseUser.email?.split('@')[0] || 'admin',
                email: firebaseUser.email || '',
                role: 'admin',
                roleAssigned: true,
              };
              // Update in localStorage
              if (storedUser) {
                const userIndex = users.findIndex((u: any) => u.email === firebaseUser.email);
                users[userIndex] = userData;
              } else {
                users.push(userData);
              }
              localStorage.setItem('users', JSON.stringify(users));
            }
          } else if (isAdminEmail) {
            // No users data but is admin email
            userData = {
              username: firebaseUser.email?.split('@')[0] || 'admin',
              email: firebaseUser.email || '',
              role: 'admin',
              roleAssigned: true,
            };
            localStorage.setItem('users', JSON.stringify([userData]));
          }
          
          // If no role assigned, create temp user and show role selection
          if (!userData) {
            userData = {
              username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
              email: firebaseUser.email || '',
              role: 'pending',
              roleAssigned: false,
            };
            setNeedsRoleAssignment(true);
          } else {
            setNeedsRoleAssignment(false);
          }
          
          setUser(userData);
          setFirebaseUser(firebaseUser);
          localStorage.setItem('currentUser', JSON.stringify(userData));
          
          // Check if first time user
          const hasSeenTour = localStorage.getItem('hasSeenTour');
          if (!hasSeenTour && userData.roleAssigned) {
            setIsFirstTimeUser(true);
          }
        } else {
          setUser(null);
          setFirebaseUser(null);
          setNeedsRoleAssignment(false);
          localStorage.removeItem('currentUser');
        }
        setLoading(false);
      });
    } catch (error) {
      console.error('Firebase auth error:', error);
      // Firebase not available, rely on localStorage
      setLoading(false);
    }

    return () => {
      clearTimeout(loadingTimeout);
      if (unsubscribe) unsubscribe();
    };
  }, [ADMIN_EMAILS]);

  const assignRole = (role: string) => {
    if (!user || !firebaseUser) return;
    
    // Check if user is trying to assign admin role
    if (role === 'admin' && !ADMIN_EMAILS.includes(firebaseUser.email || '')) {
      alert('You are not authorized to assign admin role. Please contact the system administrator.');
      return;
    }
    
    const updatedUser: User = {
      ...user,
      role: role,
      roleAssigned: true,
    };
    
    setUser(updatedUser);
    setNeedsRoleAssignment(false);
    
    // Update in localStorage
    const usersData = localStorage.getItem('users');
    const users = usersData ? JSON.parse(usersData) : [];
    const userIndex = users.findIndex((u: any) => u.email === updatedUser.email);
    
    if (userIndex >= 0) {
      users[userIndex] = updatedUser;
    } else {
      users.push(updatedUser);
    }
    
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Check if first time user for tour
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      setIsFirstTimeUser(true);
    }
  };

  const login = async (emailOrUsername: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      let email = emailOrUsername;
      let userData: User | null = null;
      
      // Check if it's a username (no @ symbol) - look up in localStorage
      if (!emailOrUsername.includes('@')) {
        const usersData = localStorage.getItem('users');
        if (usersData) {
          const users = JSON.parse(usersData);
          const userEntry = users.find((u: any) => u.username === emailOrUsername);
          if (userEntry) {
            email = userEntry.email;
          }
        }
      }
      
      // Get user from localStorage
      const usersData = localStorage.getItem('users');
      if (usersData) {
        const users = JSON.parse(usersData);
        const storedUser = users.find((u: any) => u.email === email || u.username === emailOrUsername);
        
        // For demo purposes, accept admin123 password for admin accounts
        if (storedUser && (password === 'admin123' || password === storedUser.password)) {
          userData = storedUser;
          setUser(userData);
          localStorage.setItem('currentUser', JSON.stringify(userData));
          
          if (userData && userData.roleAssigned) {
            // Check if this is first login
            const hasSeenTour = localStorage.getItem('hasSeenTour');
            if (!hasSeenTour) {
              setIsFirstTimeUser(true);
            }
            navigate('/dashboard');
          } else {
            setNeedsRoleAssignment(true);
          }
          
          setLoading(false);
          return true;
        }
      }
      
      // Try Firebase authentication if available
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // Check if this is an admin email
        const isAdminEmail = ADMIN_EMAILS.includes(userCredential.user.email || '');
        
        if (usersData) {
          const users = JSON.parse(usersData);
          const storedUser = users.find((u: any) => u.email === userCredential.user.email);
          if (storedUser && storedUser.roleAssigned) {
            userData = storedUser;
          } else if (isAdminEmail) {
            // Auto-assign admin role for authorized emails
            userData = {
              username: storedUser?.username || userCredential.user.email?.split('@')[0] || 'admin',
              email: userCredential.user.email || '',
              role: 'admin',
              roleAssigned: true,
            };
            // Update in localStorage
            if (storedUser) {
              const userIndex = users.findIndex((u: any) => u.email === userCredential.user.email);
              users[userIndex] = userData;
            } else {
              users.push(userData);
            }
            localStorage.setItem('users', JSON.stringify(users));
          } else {
            // User needs to select role
            userData = {
              username: userCredential.user.displayName || userCredential.user.email?.split('@')[0] || 'User',
              email: userCredential.user.email || '',
              role: 'pending',
              roleAssigned: false,
            };
            setNeedsRoleAssignment(true);
          }
        } else {
          // No users data, check if admin
          if (isAdminEmail) {
            userData = {
              username: userCredential.user.email?.split('@')[0] || 'admin',
              email: userCredential.user.email || '',
              role: 'admin',
              roleAssigned: true,
            };
            localStorage.setItem('users', JSON.stringify([userData]));
          } else {
            userData = {
              username: userCredential.user.displayName || userCredential.user.email?.split('@')[0] || 'User',
              email: userCredential.user.email || '',
              role: 'pending',
              roleAssigned: false,
            };
            setNeedsRoleAssignment(true);
          }
        }
        
        if (userData) {
          setUser(userData);
          setFirebaseUser(userCredential.user);
          localStorage.setItem('currentUser', JSON.stringify(userData));
          
          if (userData && userData.roleAssigned) {
            // Check if this is first login
            const hasSeenTour = localStorage.getItem('hasSeenTour');
            if (!hasSeenTour) {
              setIsFirstTimeUser(true);
            }
            navigate('/dashboard');
          }
          
          setLoading(false);
          return true;
        }
      } catch (firebaseError: any) {
        console.log('Firebase auth not available, using localStorage only');
      }
      
      // If Firebase failed and localStorage didn't work
      setLoading(false);
      return false;
    } catch (error: any) {
      console.error('Login error:', error.message);
      setLoading(false);
      return false;
    }
  };

  const register = async (email: string, password: string, username: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Check if username already exists
      const usersData = localStorage.getItem('users');
      if (usersData) {
        const users = JSON.parse(usersData);
        const usernameExists = users.some((u: any) => u.username === username);
        if (usernameExists) {
          console.error('Username already taken');
          return false;
        }
      }
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // New users need to select their role
      const userData: User = {
        username: username || userCredential.user.email?.split('@')[0] || 'User',
        email: userCredential.user.email || '',
        role: 'pending',
        roleAssigned: false,
      };
      
      setUser(userData);
      setFirebaseUser(userCredential.user);
      setNeedsRoleAssignment(true);
      
      return true;
    } catch (error: any) {
      console.error('Registration error:', error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setUser(null);
      setFirebaseUser(null);
      localStorage.removeItem('currentUser');
      navigate('/login');
    } catch (error: any) {
      console.error('Logout error:', error.message);
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error: any) {
      console.error('Password reset error:', error.message);
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // Check if user already has a role assigned
      const usersData = localStorage.getItem('users');
      let userData: User;
      
      if (usersData) {
        const users = JSON.parse(usersData);
        const storedUser = users.find((u: any) => u.email === userCredential.user.email);
        if (storedUser && storedUser.roleAssigned) {
          userData = storedUser;
        } else {
          // User needs to select role
          userData = {
            username: userCredential.user.displayName || userCredential.user.email?.split('@')[0] || 'User',
            email: userCredential.user.email || '',
            role: 'pending',
            roleAssigned: false,
          };
          setNeedsRoleAssignment(true);
        }
      } else {
        userData = {
          username: userCredential.user.displayName || userCredential.user.email?.split('@')[0] || 'User',
          email: userCredential.user.email || '',
          role: 'pending',
          roleAssigned: false,
        };
        setNeedsRoleAssignment(true);
      }
      
      setUser(userData);
      setFirebaseUser(userCredential.user);
      
      if (userData.roleAssigned) {
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        // Check if this is first login
        const hasSeenTour = localStorage.getItem('hasSeenTour');
        if (!hasSeenTour) {
          setIsFirstTimeUser(true);
        }
        
        navigate('/dashboard');
      }
      
      return true;
    } catch (error: any) {
      console.error('Google sign-in error:', error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const markTourComplete = () => {
    setIsFirstTimeUser(false);
    localStorage.setItem('hasSeenTour', 'true');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isAuthenticated: !!user && user.roleAssigned !== false,
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
        resetPassword,
        isFirstTimeUser,
        markTourComplete,
        assignRole,
        needsRoleAssignment,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
