import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const { email, otp, token } = await request.json()
    if (!email || !otp || !token) {
      return NextResponse.json({ error: 'Email, OTP, and token are required' }, { status: 400 })
    }

    // 1. Split token into expiresAt and signature hash
    const [expiresAtStr, hash] = token.split('.')
    if (!expiresAtStr || !hash) {
      return NextResponse.json({ error: 'Invalid token format' }, { status: 400 })
    }

    const expiresAt = Number(expiresAtStr)

    // 2. Check expiration
    if (Date.now() > expiresAt) {
      return NextResponse.json({ error: 'Verification code has expired. Please request a new one.' }, { status: 400 })
    }

    // 3. Recreate HMAC signature and verify
    const payload = JSON.stringify({ email, otp, expiresAt })
    const secret = process.env.GEMINI_API_KEY || 'altius-secret-key-fallback'
    const expectedHash = crypto.createHmac('sha256', secret).update(payload).digest('hex')

    if (hash !== expectedHash) {
      return NextResponse.json({ error: 'Incorrect verification code. Please try again.' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      verified: true,
      message: 'Email verified successfully.'
    })
  } catch (err: any) {
    console.error('Verify OTP Handler Error:', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
