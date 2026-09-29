import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        documents: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Cloudinary URLs are already permanent, no need for presigned URLs
    return NextResponse.json(session)
  } catch (error) {
    console.error('[sessions detail GET]', error)
    return NextResponse.json({ error: 'Failed to fetch session' }, { status: 500 })
  }
}
