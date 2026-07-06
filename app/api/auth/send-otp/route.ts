import { NextResponse } from 'next/server'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // 1. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // 2. Set expiry (5 minutes from now)
    const expiresAt = Date.now() + 5 * 60 * 1000

    // 3. Create cryptographic HMAC signature
    const payload = JSON.stringify({ email, otp, expiresAt })
    const secret = process.env.GEMINI_API_KEY || 'altius-secret-key-fallback'
    const hash = crypto.createHmac('sha256', secret).update(payload).digest('hex')
    const token = `${expiresAt}.${hash}`

    // 4. Send email if SMTP is configured
    const smtpHost = process.env.SMTP_HOST
    const smtpPort = process.env.SMTP_PORT
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASSWORD

    let emailSent = false
    let smtpError = ''

    if (smtpHost && smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: Number(smtpPort) || 587,
          secure: smtpPort === '465',
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        })

        await transporter.sendMail({
          from: `"Altius Portal" <${smtpUser}>`,
          to: email,
          subject: 'Your Altius Sign-Up OTP',
          text: `Your one-time verification code is: ${otp}. It will expire in 5 minutes.`,
          html: `<div style="font-family: sans-serif; padding: 20px; border: 1px solid #DDD5C3; border-radius: 8px; max-width: 500px;">
            <h2 style="color: #1E3A5F;">Altius World-Class Pass</h2>
            <p>Use the following verification code to complete your registration:</p>
            <div style="font-size: 24px; font-weight: bold; letter-spacing: 4px; padding: 15px; background: #FAF7F0; border: 1px solid #DDD5C3; border-radius: 4px; text-align: center; color: #1E3A5F; margin: 20px 0;">
              ${otp}
            </div>
            <p style="color: #9B9282; font-size: 12px;">This code is valid for 5 minutes. If you did not request this code, please ignore this email.</p>
          </div>`,
        })
        emailSent = true
      } catch (err: any) {
        console.error('SMTP Mail Error:', err)
        smtpError = err.message || 'SMTP config failed'
      }
    }

    // Always log to terminal for developer tracking
    console.log(`[AUTH OTP] Email: ${email} | OTP: ${otp} | Sent via SMTP: ${emailSent ? 'Yes' : 'No'}`)

    // In development mode (or if SMTP failed/not set), we return the OTP to allow seamless local verification
    const isDev = process.env.NODE_ENV === 'development' || !emailSent

    return NextResponse.json({
      success: true,
      token,
      emailSent,
      // Only reveal OTP if running locally or if SMTP isn't configured so developers can test out of the box
      otp: isDev ? otp : undefined,
      note: !emailSent ? 'SMTP not configured or failed. Returning OTP in response for development testing.' : undefined,
      error: smtpError || undefined
    })
  } catch (err: any) {
    console.error('Send OTP Handler Error:', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
