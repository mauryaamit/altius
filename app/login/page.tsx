'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { Logo } from '@/components/Logo'
import { Mail, Lock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react'

type AuthMode = 'login' | 'signup'
type SignUpStep = 'enter-details' | 'verify-otp'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<AuthMode>('login')
  const [step, setStep] = useState<SignUpStep>('enter-details')
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  
  const [otpToken, setOtpToken] = useState('')
  const [devOtp, setDevOtp] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 1. Google Sign-in Handler
  const handleGoogleSignIn = async () => {
    setError('')
    setLoading(true)
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
      router.push('/')
    } catch (err: any) {
      console.warn('Google Sign In Error:', err)
      setError(err.message || 'An error occurred during Google sign in.')
      setLoading(false)
    }
  }

  // 2. Email Login Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    setError('')
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/')
    } catch (err: any) {
      console.warn('Login error:', err)
      let userFriendlyMessage = err.message || 'Failed to log in.'
      if (
        err.code === 'auth/wrong-password' || 
        err.code === 'auth/user-not-found' || 
        err.message?.includes('invalid-credential') ||
        err.message?.includes('INVALID_LOGIN_CREDENTIALS')
      ) {
        userFriendlyMessage = 'Invalid email address or password. Please try again.'
      } else if (err.code === 'auth/invalid-email') {
        userFriendlyMessage = 'Please enter a valid email address.'
      }
      setError(userFriendlyMessage)
      setLoading(false)
    }
  }

  // 3. Email Sign Up Handler: Step 1 (Send Verification Code)
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send verification code.')
      }
      setOtpToken(data.token)
      if (data.otp) {
        setDevOtp(data.otp) // Cache generated OTP for developer convenience
      } else {
        setDevOtp('')
      }
      setStep('verify-otp')
      setLoading(false)
    } catch (err: any) {
      console.warn('Send OTP error:', err)
      setError(err.message || 'An error occurred while sending the verification code.')
      setLoading(false)
    }
  }

  // 4. Email Sign Up Handler: Step 2 (Verify Code & Create User)
  const handleVerifyAndSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password || !otp || !otpToken) return
    setError('')
    setLoading(true)
    try {
      // Step A: Crytographically verify the OTP
      const verifyRes = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, token: otpToken })
      })
      const verifyData = await verifyRes.json()
      if (!verifyRes.ok) {
        throw new Error(verifyData.error || 'Verification failed.')
      }

      // Step B: Create standard Firebase User Account
      await createUserWithEmailAndPassword(auth, email, password)
      router.push('/')
    } catch (err: any) {
      console.warn('Verification & Sign-up error:', err)
      setError(err.message || 'Failed to complete sign-up. Please ensure the code is correct.')
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card font-body">
        <div className="text-center mb-8">
          <Logo size={56} className="mb-4" />
          <h1 className="font-display text-display text-mba-ink mb-2">Altius</h1>
          <p className="text-caption text-mba-ink-soft tracking-wider font-mono uppercase">
            World-Class Pass
          </p>
        </div>

        {error && (
          <div className="error-banner mb-6 text-caption">
            <AlertCircle size={14} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-6">
          {/* Google Sign-in */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="google-btn text-body font-medium"
          >
            <svg className="mr-3" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="divider">
            <span className="font-mono text-mono-label text-mba-ink-faint bg-surface px-3">
              OR
            </span>
          </div>

          {/* Mode Selector Tabs */}
          {step === 'enter-details' && (
            <div className="auth-tabs">
              <button 
                type="button" 
                className={`auth-tab font-mono text-mono-label ${mode === 'login' ? 'active' : ''}`}
                onClick={() => { setMode('login'); setError(''); }}
              >
                Log In
              </button>
              <button 
                type="button" 
                className={`auth-tab font-mono text-mono-label ${mode === 'signup' ? 'active' : ''}`}
                onClick={() => { setMode('signup'); setError(''); }}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Mode = LOGIN */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="email-form">
              <div className="form-group">
                <label htmlFor="email" className="font-mono text-mono-label text-mba-ink-soft block mb-2">
                  Email Address
                </label>
                <div className="input-wrapper">
                  <span className="input-icon-wrapper">
                    <Mail size={16} />
                  </span>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="text-body"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="font-mono text-mono-label text-mba-ink-soft block mb-2">
                  Password
                </label>
                <div className="input-wrapper">
                  <span className="input-icon-wrapper">
                    <Lock size={16} />
                  </span>
                  <input
                    id="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="text-body"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email || !password}
                className="submit-btn text-body font-mono"
              >
                <span>Log In</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          {/* Mode = SIGNUP, Step = ENTER DETAILS */}
          {mode === 'signup' && step === 'enter-details' && (
            <form onSubmit={handleSendOtp} className="email-form">
              <div className="form-group">
                <label htmlFor="email" className="font-mono text-mono-label text-mba-ink-soft block mb-2">
                  Email Address
                </label>
                <div className="input-wrapper">
                  <span className="input-icon-wrapper">
                    <Mail size={16} />
                  </span>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="text-body"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="font-mono text-mono-label text-mba-ink-soft block mb-2">
                  Password (min. 6 chars)
                </label>
                <div className="input-wrapper">
                  <span className="input-icon-wrapper">
                    <Lock size={16} />
                  </span>
                  <input
                    id="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="text-body"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email || !password}
                className="submit-btn text-body font-mono"
              >
                <span>Send Verification OTP</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          {/* Mode = SIGNUP, Step = VERIFY OTP */}
          {mode === 'signup' && step === 'verify-otp' && (
            <form onSubmit={handleVerifyAndSignUp} className="email-form">
              <div className="text-center mb-4">
                <CheckCircle2 size={36} className="text-mba-success mx-auto mb-2" />
                <h3 className="font-display text-h3 text-mba-ink mb-1">Enter Verification Code</h3>
                <p className="text-caption text-mba-ink-soft">
                  We've sent a 6-digit verification code to <strong>{email}</strong>.
                </p>
              </div>

              {devOtp && (
                <div className="dev-otp-banner mb-5">
                  <span className="font-mono text-[10px] text-mba-accent uppercase tracking-wider block mb-1">Developer OTP (Auto-reveal)</span>
                  <span className="font-mono text-h3 text-mba-accent font-bold tracking-widest">{devOtp}</span>
                  <p className="text-[10px] text-mba-ink-soft mt-1">Copy and enter this code to verify locally.</p>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="otp" className="font-mono text-mono-label text-mba-ink-soft block mb-2">
                  6-Digit OTP
                </label>
                <div className="input-wrapper">
                  <input
                    id="otp"
                    type="text"
                    required
                    maxLength={6}
                    pattern="[0-9]{6}"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    disabled={loading}
                    style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '1.25rem', paddingLeft: '8px' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="submit-btn text-body font-mono mb-4"
              >
                <span>Verify & Sign Up</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={() => { setStep('enter-details'); setOtp(''); setError(''); }}
                className="back-btn font-mono text-mono-label block mx-auto text-center"
              >
                &larr; Change email or password
              </button>
            </form>
          )}
        </div>

        <div className="footer-note">
          <p className="text-caption text-mba-ink-faint">
            Access credentials saved locally. Session stays secure on this device.
          </p>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: var(--mba-bg);
          padding: var(--space-4);
        }
        .login-card {
          background: var(--mba-surface);
          border: 1px solid var(--mba-rule);
          padding: var(--space-7) var(--space-6);
          border-radius: var(--radius-lg);
          max-width: 400px;
          width: 100%;
          box-shadow: var(--shadow-md);
        }
        .google-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: var(--space-3);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-md);
          background: var(--mba-surface);
          color: var(--mba-ink);
          cursor: pointer;
          transition: background 150ms ease, border-color 150ms ease;
        }
        .google-btn:hover:not(:disabled) {
          background: var(--mba-surface-sunk);
          border-color: var(--mba-ink-soft);
        }
        .divider {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          margin: var(--space-6) 0;
        }
        .divider::before {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          height: 1px;
          background: var(--mba-rule);
          z-index: 1;
        }
        .divider span {
          position: relative;
          z-index: 2;
          background: var(--mba-surface);
        }
        .auth-tabs {
          display: flex;
          border-bottom: 2px solid var(--mba-rule);
          margin-bottom: var(--space-5);
        }
        .auth-tab {
          flex: 1;
          background: none;
          border: none;
          padding: var(--space-3) 0;
          font-weight: 600;
          color: var(--mba-ink-faint);
          cursor: pointer;
          text-align: center;
          position: relative;
          transition: color 150ms ease;
        }
        .auth-tab:hover {
          color: var(--mba-ink-soft);
        }
        .auth-tab.active {
          color: var(--mba-accent);
        }
        .auth-tab.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--mba-accent);
        }
        .email-form {
          margin-top: var(--space-5);
        }
        .form-group {
          margin-bottom: var(--space-5);
        }
        .input-wrapper {
          position: relative;
          width: 100%;
        }
        .input-icon-wrapper {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--mba-ink-faint);
          display: flex;
          align-items: center;
          pointer-events: none;
        }
        .input-wrapper input {
          width: 100%;
          padding: 12px 16px 12px 42px;
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-md);
          background: var(--mba-surface-sunk);
          color: var(--mba-ink);
          transition: border-color 150ms ease, background 150ms ease;
        }
        .input-wrapper input:focus {
          outline: none;
          border-color: var(--mba-accent);
          background: var(--mba-surface);
        }
        .submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          width: 100%;
          padding: var(--space-3);
          border: none;
          border-radius: var(--radius-md);
          background: var(--mba-accent);
          color: var(--mba-surface);
          cursor: pointer;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          transition: opacity 150ms ease;
        }
        .submit-btn:hover:not(:disabled) {
          opacity: 0.9;
        }
        .submit-btn:disabled {
          background: var(--mba-ink-faint);
          cursor: not-allowed;
        }
        .dev-otp-banner {
          background: var(--mba-accent-soft);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-sm);
          padding: var(--space-3);
          text-align: center;
        }
        .error-banner {
          display: flex;
          align-items: flex-start;
          gap: var(--space-2);
          background: #fdf2f2;
          border: 1px solid var(--mba-danger);
          color: var(--mba-danger);
          padding: var(--space-3);
          border-radius: var(--radius-sm);
          line-height: var(--leading-tight);
        }
        .back-btn {
          background: none;
          border: none;
          color: var(--mba-accent);
          cursor: pointer;
          text-decoration: underline;
        }
        .footer-note {
          margin-top: var(--space-6);
          padding-top: var(--space-5);
          border-top: 1px solid var(--mba-rule);
          text-align: center;
        }
      `}</style>
    </div>
  )
}
