import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ScreenPlayer from './ScreenPlayer'

export default async function ScreenViewerPage({
  params,
}: {
  params: Promise<{ screenId: string }>
}) {
  const { screenId } = await params
  const screen = await prisma.screen.findUnique({
    where: { id: screenId },
  })

  if (!screen) notFound()

  return <ScreenPlayer screenName={screen.name} />
}
