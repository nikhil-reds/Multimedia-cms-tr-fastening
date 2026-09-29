import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { uploadFile } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const files = formData.getAll('files') as File[]
  const validFiles = files.filter((f) => f instanceof File && f.size > 0)

  if (validFiles.length === 0) {
    return NextResponse.json({ error: 'No files provided' }, { status: 400 })
  }

  const session = await prisma.session.create({
    data: { status: 'UPLOADING' },
  })

  try {
    for (const file of validFiles) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const mimeType = file.type || 'application/octet-stream'

      const { url: cloudinaryUrl, publicId: cloudinaryPublicId } = await uploadFile(
        buffer,
        file.name,
        mimeType
      )

      await prisma.document.create({
        data: {
          sessionId: session.id,
          name: file.name,
          size: file.size,
          mimeType,
          cloudinaryUrl,
          cloudinaryPublicId,
          status: 'UPLOADED',
        },
      })
    }

    const result = await prisma.session.update({
      where: { id: session.id },
      data: { status: 'COMPLETED' },
      include: { documents: true },
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    await prisma.session
      .update({ where: { id: session.id }, data: { status: 'FAILED' } })
      .catch(() => {})

    console.error('[upload]', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
