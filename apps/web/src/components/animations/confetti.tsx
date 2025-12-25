'use client'

import { useEffect, useState } from 'react'

interface ConfettiPiece {
  id: number
  x: number
  color: string
  delay: number
  duration: number
  size: number
}

interface ConfettiProps {
  active?: boolean
  duration?: number
  particleCount?: number
}

const COLORS = [
  '#ed7412', // primary
  '#f59e0b', // accent
  '#22c55e', // green
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#f97316', // orange
]

export function Confetti({ active = true, duration = 3000, particleCount = 50 }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])
  const [isVisible, setIsVisible] = useState(active)

  useEffect(() => {
    if (active) {
      setIsVisible(true)
      const newPieces: ConfettiPiece[] = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 500,
        duration: 2000 + Math.random() * 2000,
        size: 8 + Math.random() * 8,
      }))
      setPieces(newPieces)

      const timer = setTimeout(() => {
        setIsVisible(false)
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [active, duration, particleCount])

  if (!isVisible) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti"
          style={{
            left: `${piece.x}%`,
            top: '-20px',
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animationDelay: `${piece.delay}ms`,
            animationDuration: `${piece.duration}ms`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </div>
  )
}

// Celebration wrapper with confetti and success message
interface CelebrationProps {
  title: string
  message: string
  icon?: React.ReactNode
  children?: React.ReactNode
}

export function Celebration({ title, message, icon, children }: CelebrationProps) {
  return (
    <div className="relative">
      <Confetti active={true} />
      <div className="text-center animate-celebration">
        {icon && (
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-accent-100 animate-bounce-in">
            {icon}
          </div>
        )}
        <h2 className="font-display text-3xl font-bold text-warm-900 md:text-4xl animate-fade-in-up">
          {title}
        </h2>
        <p className="mt-4 text-lg text-warm-600 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          {message}
        </p>
        {children && (
          <div className="mt-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            {children}
          </div>
        )}
      </div>
    </div>
  )
}
