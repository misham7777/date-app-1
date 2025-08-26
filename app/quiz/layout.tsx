import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Relationship Intelligence Quiz - Find the Truth',
  description: 'Take our quick quiz to discover if your partner is on dating apps. Our AI searches across 50+ platforms to find the truth.',
  keywords: 'relationship intelligence, dating app search, partner finder, relationship truth',
}

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
