import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSession, hashPassword, isValidEmail, normalizeEmail, toPublicUser, verifyPassword } from '@/lib/auth'

// Compared against when the email is unknown, so both cases take about the same time.
const dummyHash = hashPassword('not-a-real-password')

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({})) as { email?: unknown; password?: unknown; remember?: unknown }
    const email = normalizeEmail(body.email)
    const password = typeof body.password === 'string' ? body.password : ''

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Enter a valid email address' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    const valid = await verifyPassword(password, user?.passwordHash ?? await dummyHash)
    if (!user || !valid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })
    await createSession(user.id, request, body.remember === true)

    return NextResponse.json({ user: toPublicUser(updated) })
  } catch (error) {
    console.error('[auth login POST]', error)
    return NextResponse.json({ error: 'Failed to sign in' }, { status: 500 })
  }
}
