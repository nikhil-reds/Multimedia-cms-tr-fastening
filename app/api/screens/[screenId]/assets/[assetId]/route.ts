import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ screenId: string; assetId: string }> }
) {
  try {
    const { screenId, assetId } = await params
    await prisma.screenAsset.deleteMany({
      where: {
        id: assetId,
        screenId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[screen assets DELETE]', error)
    return NextResponse.json({ error: 'Failed to remove screen asset' }, { status: 500 })
  }
}
