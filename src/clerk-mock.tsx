import React, { useState, useEffect, createContext, useContext } from 'react';
import { auth } from './lib/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut, User, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './components/Logo';
import { useAppStore } from './lib/store';

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

const getAuthErrorMessage = (err: any) => {
  const code = err?.code || '';
  const message = err?.message || 'Authentication failed. Please try again.';

  if (code === 'auth/invalid-credential' || message.includes('auth/invalid-credential')) {
    return 'Invalid email or password.';
  }
  if (code === 'auth/email-already-in-use' || message.includes('auth/email-already-in-use')) {
    return 'An account with this email already exists.';
  }
  if (code === 'auth/weak-password' || message.includes('auth/weak-password')) {
    return 'Password must be at least 6 characters.';
  }
  if (code === 'auth/popup-closed-by-user') {
    return 'Google sign-in was closed before it finished.';
  }
  if (code === 'auth/cancelled-popup-request') {
    return 'Another Google sign-in window is already open.';
  }
  if (code === 'auth/unauthorized-domain') {
    return `Google sign-in is not enabled for ${window.location.hostname}. Add this domain in Firebase Console > Authentication > Settings > Authorized domains.`;
  }
  if (code === 'auth/operation-not-allowed') {
    return 'Google sign-in is not enabled in Firebase Console > Authentication > Sign-in method.';
  }

  return message;
};

// Auth Context
type AuthContextType = {
  user: User | null;
  isLoaded: boolean;
  setShowLoginModal: (show: boolean) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoaded: false,
  setShowLoginModal: () => {}
});

// The actual Login Modal Component
const LoginModal = ({ onClose }: { onClose: () => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      if (err?.code === 'auth/popup-blocked') {
        await signInWithRedirect(auth, googleProvider);
        return;
      }
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    // Lock body scroll while modal is open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#050b14]/80 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }} 
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-[80px] border border-white/20 rounded-3xl shadow-[0_0_50px_rgba(56,189,248,0.15)] overflow-hidden relative"
      >
        {/* Inner ambient glow for glass effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />

        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50 cursor-pointer"
        >
          ✕
        </button>
        
        <div className="p-10 relative z-10">
          <div className="flex justify-center mb-8 relative">
            <Logo className="w-20 h-20 drop-shadow-[0_0_25px_rgba(34,211,238,0.3)] animate-pulse-slow" />
          </div>
          
          <h2 className="text-2xl font-bold text-center text-white mb-2 tracking-tight">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-center text-slate-400 mb-8 text-sm">
            Secure access to enterprise threat intelligence
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium">
                {error}
              </motion.div>
            )}
            
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Work Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors shadow-inner text-sm"
                placeholder="analyst@company.com"
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors shadow-inner text-sm"
                placeholder="••••••••"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-[0_5px_20px_rgba(29,78,216,0.4)] hover:shadow-[0_10px_25px_rgba(29,78,216,0.5)] transition-all disabled:opacity-50 mt-6 tracking-widest uppercase text-[12px]"
            >
              {loading ? 'Authenticating...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>
          
          <div className="mt-6 flex items-center justify-between">
            <span className="w-1/5 border-b border-white/10 lg:w-1/4"></span>
            <span className="text-xs text-center text-slate-500 uppercase font-bold tracking-widest">or</span>
            <span className="w-1/5 border-b border-white/10 lg:w-1/4"></span>
          </div>
          
          <button 
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full mt-6 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-medium py-3.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center space-x-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 24c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 21.53 7.7 24 12 24z"/>
              <path fill="#FBBC05" d="M5.84 15.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V8.06H2.18C1.43 9.55 1 11.22 1 13s.43 3.45 1.18 4.94l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 4.64c1.61 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.19 14.97 0 12 0 7.7 0 3.99 2.47 2.18 6.06l3.66 2.84c.87-2.6 3.3-4.26 6.16-4.26z"/>
            </svg>
            <span>Continue with Google</span>
          </button>
          
          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <button 
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-slate-400 hover:text-white text-[13px] font-medium transition-colors"
            >
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span className="text-blue-400 font-bold">{isLogin ? 'Sign up' : 'Sign in'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Provider Component
export const ClerkProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    // Handle redirect sign-in result (Google sign-in on mobile browsers)
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          // onAuthStateChanged will fire automatically; just close the modal
          setShowLoginModal(false);
        }
      })
      .catch((err) => {
        console.error('Google redirect sign-in failed:', getAuthErrorMessage(err));
      });

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoaded(true);
      if (currentUser) {
        setShowLoginModal(false);
        // Sync Pro status and credits from Firestore
        useAppStore.getState().syncUserStatus(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoaded, setShowLoginModal }}>
      {children}
      
      {/* Login Modal Overlay */}
      <AnimatePresence>
        {showLoginModal && !user && (
          <LoginModal onClose={() => setShowLoginModal(false)} />
        )}
      </AnimatePresence>
    </AuthContext.Provider>
  );
};

// Hooks & Components matching original API
export const useUser = () => {
  const { user, isLoaded } = useContext(AuthContext);
  return {
    isLoaded,
    isSignedIn: !!user,
    user: user ? {
      fullName: user.displayName || 'Security Analyst',
      primaryEmailAddress: { emailAddress: user.email },
      photoURL: user.photoURL,
      creationTime: user.metadata?.creationTime,
      lastSignInTime: user.metadata?.lastSignInTime,
      providerId: user.providerData?.[0]?.providerId || 'password'
    } : null
  };
};

export const useClerk = () => {
  return {
    signOut: () => firebaseSignOut(auth)
  };
};

export const SignedIn = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoaded } = useContext(AuthContext);
  if (!isLoaded || !user) return null;
  return <>{children}</>;
};

export const SignedOut = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoaded } = useContext(AuthContext);
  if (!isLoaded || user) return null;
  return <>{children}</>;
};

export const SignInButton = ({ children }: { children: React.ReactNode, mode?: string }) => {
  const { setShowLoginModal } = useContext(AuthContext);
  return <div className="cursor-pointer inline-block" onClick={() => setShowLoginModal(true)}>{children}</div>;
};

export const SignUpButton = ({ children }: { children: React.ReactNode, mode?: string }) => {
  const { setShowLoginModal } = useContext(AuthContext);
  return <div className="cursor-pointer inline-block" onClick={() => setShowLoginModal(true)}>{children}</div>;
};

export const UserButton = ({ onNavigateToProfile }: { onNavigateToProfile?: () => void; [key: string]: any }) => {
  const { user } = useContext(AuthContext);
  const initials = user?.email ? user.email.substring(0, 2).toUpperCase() : 'DA';
  
  return (
    <div 
      className="h-10 w-10 bg-blue-700 rounded-full border border-blue-400/50 flex items-center justify-center text-white font-bold cursor-pointer hover:scale-105 transition-transform shadow-[0_0_15px_rgba(29,78,216,0.5)]"
      onClick={() => onNavigateToProfile ? onNavigateToProfile() : firebaseSignOut(auth)}
      title={onNavigateToProfile ? `Profile (${user?.email})` : `Sign Out (${user?.email})`}
    >
      {user?.photoURL ? (
        <img src={user.photoURL} alt="" className="h-10 w-10 rounded-full object-cover" />
      ) : (
        initials
      )}
    </div>
  );
};
