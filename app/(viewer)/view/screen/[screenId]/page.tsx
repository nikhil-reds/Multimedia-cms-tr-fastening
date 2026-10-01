import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ScreenPlayer from './ScreenPlayer'

export default async function ScreenViewerPage({
  params,
  searchParams,
}: {
  params: Promise<{ screenId: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { screenId } = await params
  const kiosk = (await searchParams).kiosk === '1'
  const screen = await prisma.screen.findUnique({
    where: { id: screenId },
    include: {
      assets: {
        orderBy: { position: 'asc' },
        include: { document: true },
      },
    },
  })

  if (!screen) notFound()

  const assets = screen.assets.map((asset) => ({
    id: asset.id,
    document: {
      id: asset.document.id,
      name: asset.document.name,
      mimeType: asset.document.mimeType,
      s3Url: asset.document.cloudinaryUrl || asset.document.websiteUrl || '',
      websiteUrl: asset.document.websiteUrl,
      sourceType: asset.document.sourceType,
    },
  }))

  return <ScreenPlayer screenName={screen.name} assets={assets} kiosk={kiosk} />
}
