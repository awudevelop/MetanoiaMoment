'use client'

import { useState } from 'react'
import { Button, useToast } from '@metanoia/ui'
import {
  Share2,
  Facebook,
  Twitter,
  Mail,
  MessageCircle,
  Link2,
  Check,
  X,
  QrCode,
} from 'lucide-react'

interface SocialShareProps {
  url: string
  title: string
  description?: string
  hashtags?: string[]
  variant?: 'buttons' | 'icons' | 'menu'
  size?: 'sm' | 'md' | 'lg'
  showQR?: boolean
  className?: string
}

export function SocialShare({
  url,
  title,
  description = '',
  hashtags = ['MetanoiaMoment', 'Faith', 'Testimony'],
  variant = 'buttons',
  size = 'md',
  showQR = false,
  className = '',
}: SocialShareProps) {
  const toast = useToast()
  const [copied, setCopied] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const encodedDescription = encodeURIComponent(description)
  const hashtagString = hashtags.join(',')

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${hashtagString}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0AWatch here: ${encodedUrl}`,
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('Link copied!', 'Share it with your friends and family.')
      setTimeout(() => setCopied(false), 3000)
    } catch {
      toast.error('Failed to copy', 'Please try again.')
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        })
      } catch {
        // User cancelled
      }
    } else {
      handleCopyLink()
    }
  }

  const openShareWindow = (platform: keyof typeof shareLinks) => {
    const shareUrl = shareLinks[platform]
    if (platform === 'email') {
      window.location.href = shareUrl
    } else {
      window.open(shareUrl, '_blank', 'width=600,height=400,noopener,noreferrer')
    }
  }

  const iconSize = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'
  const buttonSize = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default'

  if (variant === 'icons') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <button
          onClick={() => openShareWindow('facebook')}
          className="rounded-full bg-[#1877F2] p-2 text-white transition-transform hover:scale-110"
          aria-label="Share on Facebook"
        >
          <Facebook className={iconSize} />
        </button>
        <button
          onClick={() => openShareWindow('twitter')}
          className="rounded-full bg-[#1DA1F2] p-2 text-white transition-transform hover:scale-110"
          aria-label="Share on Twitter"
        >
          <Twitter className={iconSize} />
        </button>
        <button
          onClick={() => openShareWindow('whatsapp')}
          className="rounded-full bg-[#25D366] p-2 text-white transition-transform hover:scale-110"
          aria-label="Share on WhatsApp"
        >
          <MessageCircle className={iconSize} />
        </button>
        <button
          onClick={() => openShareWindow('email')}
          className="rounded-full bg-warm-600 p-2 text-white transition-transform hover:scale-110"
          aria-label="Share via Email"
        >
          <Mail className={iconSize} />
        </button>
        <button
          onClick={handleCopyLink}
          className="rounded-full bg-warm-200 p-2 text-warm-700 transition-transform hover:scale-110"
          aria-label="Copy link"
        >
          {copied ? <Check className={iconSize} /> : <Link2 className={iconSize} />}
        </button>
        {showQR && (
          <button
            onClick={() => setShowQRModal(true)}
            className="rounded-full bg-warm-200 p-2 text-warm-700 transition-transform hover:scale-110"
            aria-label="Show QR code"
          >
            <QrCode className={iconSize} />
          </button>
        )}

        {showQRModal && (
          <QRCodeModal url={url} title={title} onClose={() => setShowQRModal(false)} />
        )}
      </div>
    )
  }

  if (variant === 'menu') {
    return (
      <ShareMenu
        url={url}
        title={title}
        description={description}
        onShare={openShareWindow}
        onCopy={handleCopyLink}
        onNativeShare={handleNativeShare}
        copied={copied}
        showQR={showQR}
      />
    )
  }

  // Default: buttons variant
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size={buttonSize as 'sm' | 'lg'}
          onClick={() => openShareWindow('facebook')}
          className="justify-start border-[#1877F2] text-[#1877F2] hover:bg-[#1877F2] hover:text-white"
        >
          <Facebook className="mr-2 h-4 w-4" />
          Facebook
        </Button>
        <Button
          variant="outline"
          size={buttonSize as 'sm' | 'lg'}
          onClick={() => openShareWindow('twitter')}
          className="justify-start border-[#1DA1F2] text-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white"
        >
          <Twitter className="mr-2 h-4 w-4" />
          Twitter
        </Button>
        <Button
          variant="outline"
          size={buttonSize as 'sm' | 'lg'}
          onClick={() => openShareWindow('whatsapp')}
          className="justify-start border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white"
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          WhatsApp
        </Button>
        <Button
          variant="outline"
          size={buttonSize as 'sm' | 'lg'}
          onClick={() => openShareWindow('email')}
          className="justify-start"
        >
          <Mail className="mr-2 h-4 w-4" />
          Email
        </Button>
      </div>
      <Button
        variant="outline"
        size={buttonSize as 'sm' | 'lg'}
        onClick={handleCopyLink}
        className="w-full"
      >
        {copied ? (
          <>
            <Check className="mr-2 h-4 w-4 text-accent-500" />
            Link Copied!
          </>
        ) : (
          <>
            <Link2 className="mr-2 h-4 w-4" />
            Copy Link
          </>
        )}
      </Button>
      {showQR && (
        <Button
          variant="ghost"
          size={buttonSize as 'sm' | 'lg'}
          onClick={() => setShowQRModal(true)}
          className="w-full"
        >
          <QrCode className="mr-2 h-4 w-4" />
          Show QR Code
        </Button>
      )}

      {showQRModal && (
        <QRCodeModal url={url} title={title} onClose={() => setShowQRModal(false)} />
      )}
    </div>
  )
}

// Share Menu (dropdown style)
function ShareMenu({
  url,
  title,
  description,
  onShare,
  onCopy,
  onNativeShare,
  copied,
  showQR,
}: {
  url: string
  title: string
  description: string
  onShare: (platform: 'facebook' | 'twitter' | 'whatsapp' | 'email') => void
  onCopy: () => void
  onNativeShare: () => void
  copied: boolean
  showQR: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)

  return (
    <div className="relative">
      <Button variant="outline" size="sm" onClick={() => setIsOpen(!isOpen)}>
        <Share2 className="mr-2 h-4 w-4" />
        Share
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-warm-200 bg-white py-2 shadow-lg">
            <button
              onClick={() => {
                onShare('facebook')
                setIsOpen(false)
              }}
              className="flex w-full items-center gap-3 px-4 py-2 text-sm text-warm-700 hover:bg-warm-50"
            >
              <Facebook className="h-4 w-4 text-[#1877F2]" />
              Share on Facebook
            </button>
            <button
              onClick={() => {
                onShare('twitter')
                setIsOpen(false)
              }}
              className="flex w-full items-center gap-3 px-4 py-2 text-sm text-warm-700 hover:bg-warm-50"
            >
              <Twitter className="h-4 w-4 text-[#1DA1F2]" />
              Share on Twitter
            </button>
            <button
              onClick={() => {
                onShare('whatsapp')
                setIsOpen(false)
              }}
              className="flex w-full items-center gap-3 px-4 py-2 text-sm text-warm-700 hover:bg-warm-50"
            >
              <MessageCircle className="h-4 w-4 text-[#25D366]" />
              Share on WhatsApp
            </button>
            <button
              onClick={() => {
                onShare('email')
                setIsOpen(false)
              }}
              className="flex w-full items-center gap-3 px-4 py-2 text-sm text-warm-700 hover:bg-warm-50"
            >
              <Mail className="h-4 w-4" />
              Share via Email
            </button>
            <div className="my-2 border-t border-warm-100" />
            <button
              onClick={() => {
                onCopy()
                setIsOpen(false)
              }}
              className="flex w-full items-center gap-3 px-4 py-2 text-sm text-warm-700 hover:bg-warm-50"
            >
              {copied ? (
                <Check className="h-4 w-4 text-accent-500" />
              ) : (
                <Link2 className="h-4 w-4" />
              )}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
            {showQR && (
              <button
                onClick={() => {
                  setShowQRModal(true)
                  setIsOpen(false)
                }}
                className="flex w-full items-center gap-3 px-4 py-2 text-sm text-warm-700 hover:bg-warm-50"
              >
                <QrCode className="h-4 w-4" />
                Show QR Code
              </button>
            )}
          </div>
        </>
      )}

      {showQRModal && (
        <QRCodeModal url={url} title={title} onClose={() => setShowQRModal(false)} />
      )}
    </div>
  )
}

// QR Code Modal (generates QR code using API)
function QRCodeModal({
  url,
  title,
  onClose,
}: {
  url: string
  title: string
  onClose: () => void
}) {
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = qrApiUrl
    link.download = `metanoia-${title.toLowerCase().replace(/\s+/g, '-')}-qr.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl animate-scale-in">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-warm-400 hover:bg-warm-100 hover:text-warm-600"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center">
          <QrCode className="mx-auto mb-2 h-8 w-8 text-primary-500" />
          <h2 className="text-lg font-semibold text-warm-900">Share via QR Code</h2>
          <p className="mt-1 text-sm text-warm-500">
            Scan this code to watch "{title}"
          </p>
        </div>

        <div className="my-6 flex justify-center">
          <div className="overflow-hidden rounded-xl border-4 border-primary-100 bg-white p-2">
            <img
              src={qrApiUrl}
              alt={`QR code for ${title}`}
              className="h-48 w-48"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Close
          </Button>
          <Button className="flex-1" onClick={handleDownload}>
            Download
          </Button>
        </div>
      </div>
    </div>
  )
}

// Quick share button for cards (compact version)
export function QuickShareButton({
  url,
  title,
  className = '',
}: {
  url: string
  title: string
  className?: string
}) {
  const toast = useToast()

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(url)
      toast.success('Link copied!', 'Share it with your friends.')
    }
  }

  return (
    <button
      onClick={handleShare}
      className={`rounded-full bg-white/90 p-2 text-warm-600 shadow-sm backdrop-blur-sm transition-all hover:scale-110 hover:bg-white hover:text-primary-600 ${className}`}
      aria-label="Share"
    >
      <Share2 className="h-4 w-4" />
    </button>
  )
}

// Full-page share modal
export function ShareModal({
  isOpen,
  onClose,
  url,
  title,
  description = '',
}: {
  isOpen: boolean
  onClose: () => void
  url: string
  title: string
  description?: string
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl animate-scale-in">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-warm-400 hover:bg-warm-100 hover:text-warm-600"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-6">
          <Share2 className="mx-auto mb-2 h-8 w-8 text-primary-500" />
          <h2 className="text-xl font-semibold text-warm-900">Share This Testimony</h2>
          <p className="mt-1 text-sm text-warm-500 line-clamp-2">{title}</p>
        </div>

        <SocialShare
          url={url}
          title={title}
          description={description}
          variant="buttons"
          showQR={true}
        />
      </div>
    </div>
  )
}
