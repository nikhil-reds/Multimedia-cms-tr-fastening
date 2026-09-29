import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const documents = await prisma.document.findMany({
      orderBy: { createdAt: 'desc' },
    })

    // Cloudinary URLs are already permanent, no need for presigned URLs
    return NextResponse.json(documents)
  } catch (error) {
    console.error('[documents GET]', error)
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { url?: string; name?: string }
    const rawUrl = body.url?.trim()

    if (!rawUrl) {
      return NextResponse.json({ error: 'Website URL is required' }, { status: 400 })
    }

    let parsedUrl: URL
    try {
      parsedUrl = new URL(rawUrl)
    } catch {
      return NextResponse.json({ error: 'Enter a valid website URL' }, { status: 400 })
    }

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return NextResponse.json({ error: 'Website URL must start with http:// or https://' }, { status: 400 })
    }

    const session = await prisma.session.create({
      data: { status: 'COMPLETED' },
    })

    const document = await prisma.document.create({
      data: {
        sessionId: session.id,
        name: body.name?.trim() || parsedUrl.hostname,
        size: 0,
        mimeType: 'text/uri-list',
        sourceType: 'WEBSITE',
        websiteUrl: parsedUrl.toString(),
        status: 'UPLOADED',
      },
    })

    return NextResponse.json(document, { status: 201 })
  } catch (error) {
    console.error('[documents POST]', error)
    return NextResponse.json({ error: 'Failed to save website URL' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { ids } = await request.json() as { ids: string[] }
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'List of document IDs is required' }, { status: 400 })
    }

    const deleted = await prisma.document.deleteMany({
      where: { id: { in: ids } },
    })

    return NextResponse.json({ success: true, count: deleted.count })
  } catch (error) {
    console.error('[documents bulk DELETE]', error)
    return NextResponse.json({ error: 'Failed to perform bulk delete' }, { status: 500 })
  }
}
