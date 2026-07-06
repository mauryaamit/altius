'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink 
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { Logo } from '@/components/Logo'
import { Mail, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [error, setError] = useState('')
  const [verifyingLink, setVerifyingLink] = useState(false)

  // Handle email magic link verification if landing on login page with link
  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      setVerifyingLink(true)
      let storedEmail = window.localStorage.getItem('emailForSignIn') || ''
      if (!storedEmail) {
        // Fallback: ask user for email if not found in local storage
        const inputEmail = window.prompt('Please enter your email to complete sign in:')
        if (inputEmail) storedEmail = inputEmail
      }

      if (storedEmail) {
        signInWithEmailLink(auth, storedEmail, window.location.href)
          .then(() => {
            window.localStorage.removeItem('emailForSignIn')
            router.push('/')
          })
          .catch((err) => {
            console.warn('Email link sign in error:', err)
            setError('Failed to complete sign in. The link may have expired.')
            setVerifyingLink(false)
          })
      } else {
        setError('Email is required to complete sign-in.')
        setVerifyingLink(false)
      }
    }
  }, [router])

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

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setError('')
    setLoading(true)

    const actionCodeSettings = {
      // URL to redirect back to. Must be authorized in Firebase Console.
      url: window.location.origin + '/login',
      handleCodeInApp: true,
    }

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings)
      window.localStorage.setItem('emailForSignIn', email)
      setEmailSent(true)
      setLoading(false)
    } catch (err: any) {
      console.warn('Email Sign In Link Error:', err)
      let userFriendlyMessage = err.message || 'Failed to send magic link. Please check your email address.'
      if (err.code === 'auth/operation-not-allowed' || (err.message && err.message.includes('operation-not-allowed'))) {
        userFriendlyMessage = 'Passwordless Email Link sign-in is not enabled in your Firebase console. Please go to Firebase Console > Authentication > Sign-in method, click "Email/Password" (under Sign-in providers), turn on the "Email link (passwordless sign-in)" switch, and click Save.'
      }
      setError(userFriendlyMessage)
      setLoading(false)
    }
  }

  if (verifyingLink) {
    return (
      <div className="login-container">
        <div className="login-card text-center font-body">
          <Logo size={48} className="mb-6 animate-pulse" />
          <h2 className="font-display text-h2 mb-4 text-mba-ink">Verifying credentials...</h2>
          <p className="text-body text-mba-ink-soft">Establishing secure session. This will take a moment.</p>
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
            padding: var(--space-7);
            border-radius: var(--radius-lg);
            max-width: 420px;
            width: 100%;
            box-shadow: var(--shadow-md);
            text-align: center;
          }
        `}</style>
      </div>
    )
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

        {emailSent ? (
          <div className="text-center py-4">
            <CheckCircle2 size={40} className="text-mba-success mx-auto mb-4" />
            <h3 className="font-display text-h3 text-mba-ink mb-2">Check your email</h3>
            <p className="text-caption text-mba-ink-soft mb-6">
              We sent a magic sign-in link to <strong>{email}</strong>. Click the link in your inbox to access your account instantly.
            </p>
            <button 
              onClick={() => setEmailSent(false)} 
              className="font-mono text-mono-label back-btn"
            >
              Change email address
            </button>
          </div>
        ) : (
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

            {/* Email link form */}
            <form onSubmit={handleEmailSignIn} className="email-form">
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

              <button
                type="submit"
                disabled={loading || !email}
                className="submit-btn text-body font-mono"
              >
                <span>Send Magic Link</span>
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        )}

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
