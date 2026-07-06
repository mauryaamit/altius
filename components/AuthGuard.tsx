'use client'
import React, { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { Logo } from '@/components/Logo'
import { AltiusShell } from '@/components/AltiusShell'
import { useMbaStore } from '@/lib/stores/mbaStore'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)

      const isLoginPage = pathname === '/login'

      if (currentUser) {
        useMbaStore.getState().syncFromFirestore(currentUser.uid)
      }

      if (!currentUser && !isLoginPage) {
        router.push('/login')
      } else if (currentUser && isLoginPage) {
        router.push('/')
      }
    })

    return () => unsubscribe()
  }, [pathname, router])

  // Simple loading skeleton while auth initializes (aims for <500ms)
  if (loading) {
    return (
      <div className="auth-loader">
        <div className="loader-inner text-center font-body">
          <Logo size={40} className="mb-4 animate-pulse" />
          <p className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest">
            Initializing secure session...
          </p>
        </div>
        <style jsx>{`
          .auth-loader {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background-color: var(--mba-bg);
          }
          .loader-inner {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
        `}</style>
      </div>
    )
  }

  // Enforce redirection to login if no user is present
  if (!user && pathname !== '/login') {
    return null // Will redirect in useEffect
  }

  if (pathname === '/login') {
    return <>{children}</>
  }

  return <AltiusShell>{children}</AltiusShell>
}
