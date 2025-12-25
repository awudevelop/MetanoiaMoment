import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const title = searchParams.get('title') || 'Metanoia Moment'
  const description = searchParams.get('description') || 'Share your testimony of transformation'
  const author = searchParams.get('author')
  const type = searchParams.get('type') || 'default'

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FDF8F6',
          backgroundImage: 'linear-gradient(135deg, #FDF8F6 0%, #F5EBE6 50%, #E8D5CC 100%)',
        }}
      >
        {/* Background decoration */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(139, 92, 246, 0.1)',
            filter: 'blur(60px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -100,
            left: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.1)',
            filter: 'blur(60px)',
          }}
        />

        {/* Content container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 80px',
            maxWidth: '100%',
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ color: 'white', fontSize: '32px', fontWeight: 700 }}>M</span>
            </div>
            {type === 'default' && (
              <span
                style={{
                  fontSize: '28px',
                  fontWeight: 600,
                  color: '#44403C',
                }}
              >
                Metanoia Moment
              </span>
            )}
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: type === 'testimony' ? '56px' : '64px',
              fontWeight: 700,
              color: '#1C1917',
              textAlign: 'center',
              lineHeight: 1.2,
              maxWidth: '1000px',
              marginBottom: '24px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {title}
          </div>

          {/* Description */}
          {description && (
            <div
              style={{
                fontSize: '24px',
                color: '#57534E',
                textAlign: 'center',
                maxWidth: '800px',
                lineHeight: 1.5,
                marginBottom: '32px',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {description}
            </div>
          )}

          {/* Author (for testimony type) */}
          {type === 'testimony' && author && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginTop: '16px',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: '#E9D5FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ color: '#7C3AED', fontSize: '20px', fontWeight: 600 }}>
                  {author.charAt(0).toUpperCase()}
                </span>
              </div>
              <span style={{ fontSize: '20px', color: '#57534E' }}>
                by {author}
              </span>
            </div>
          )}

          {/* Video badge for testimony */}
          {type === 'testimony' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '24px',
                padding: '12px 24px',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                borderRadius: '9999px',
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                style={{ color: '#7C3AED' }}
              >
                <polygon
                  points="5 3 19 12 5 21 5 3"
                  fill="currentColor"
                />
              </svg>
              <span style={{ color: '#7C3AED', fontSize: '18px', fontWeight: 500 }}>
                Watch Testimony
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#78716C',
            fontSize: '18px',
          }}
        >
          <span>metanoiamoment.org</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
