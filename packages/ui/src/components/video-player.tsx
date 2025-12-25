'use client'

import * as React from 'react'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Volume1,
  Maximize,
  Minimize,
  PictureInPicture2,
  Settings,
  SkipBack,
  SkipForward,
} from 'lucide-react'
import { cn } from '../lib/utils'

const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]
const SEEK_SECONDS = 10

export interface VideoPlayerProps {
  src: string
  poster?: string
  className?: string
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
  onTimeUpdate?: (currentTime: number, duration: number) => void
}

export function VideoPlayer({
  src,
  poster,
  className,
  autoPlay = false,
  muted = false,
  loop = false,
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate,
}: VideoPlayerProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [isMuted, setIsMuted] = React.useState(muted)
  const [volume, setVolume] = React.useState(1)
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const [isPiP, setIsPiP] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [buffered, setBuffered] = React.useState(0)
  const [currentTime, setCurrentTime] = React.useState(0)
  const [duration, setDuration] = React.useState(0)
  const [showControls, setShowControls] = React.useState(true)
  const [showSpeedMenu, setShowSpeedMenu] = React.useState(false)
  const [showVolumeSlider, setShowVolumeSlider] = React.useState(false)
  const [playbackSpeed, setPlaybackSpeed] = React.useState(1)
  const [isFocused, setIsFocused] = React.useState(false)
  const [pipSupported, setPipSupported] = React.useState(false)

  // Format time display (mm:ss or hh:mm:ss)
  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return '0:00'
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Hide controls after inactivity
  const resetControlsTimeout = React.useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    setShowControls(true)
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
        setShowSpeedMenu(false)
        setShowVolumeSlider(false)
      }, 3000)
    }
  }, [isPlaying])

  // Video event listeners
  React.useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      const prog = (video.currentTime / video.duration) * 100
      setProgress(isNaN(prog) ? 0 : prog)
      setCurrentTime(video.currentTime)
      onTimeUpdate?.(video.currentTime, video.duration)
    }

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1)
        const buff = (bufferedEnd / video.duration) * 100
        setBuffered(isNaN(buff) ? 0 : buff)
      }
    }

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
    }

    const handlePlay = () => {
      setIsPlaying(true)
      onPlay?.()
    }

    const handlePause = () => {
      setIsPlaying(false)
      onPause?.()
    }

    const handleEnded = () => {
      setIsPlaying(false)
      onEnded?.()
    }

    const handleEnterPiP = () => setIsPiP(true)
    const handleLeavePiP = () => setIsPiP(false)

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('progress', handleProgress)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('enterpictureinpicture', handleEnterPiP)
    video.addEventListener('leavepictureinpicture', handleLeavePiP)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('progress', handleProgress)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('enterpictureinpicture', handleEnterPiP)
      video.removeEventListener('leavepictureinpicture', handleLeavePiP)
    }
  }, [onPlay, onPause, onEnded, onTimeUpdate])

  // Fullscreen change listener
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Check PiP support on mount
  React.useEffect(() => {
    setPipSupported(!!document.pictureInPictureEnabled)
  }, [])

  // Keyboard controls
  React.useEffect(() => {
    if (!isFocused) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const video = videoRef.current
      if (!video) return

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault()
          togglePlay()
          break
        case 'arrowleft':
        case 'j':
          e.preventDefault()
          seekBy(-SEEK_SECONDS)
          break
        case 'arrowright':
        case 'l':
          e.preventDefault()
          seekBy(SEEK_SECONDS)
          break
        case 'arrowup':
          e.preventDefault()
          adjustVolume(0.1)
          break
        case 'arrowdown':
          e.preventDefault()
          adjustVolume(-0.1)
          break
        case 'm':
          e.preventDefault()
          toggleMute()
          break
        case 'f':
          e.preventDefault()
          toggleFullscreen()
          break
        case 'p':
          e.preventDefault()
          togglePiP()
          break
        case ',':
          e.preventDefault()
          cycleSpeed(-1)
          break
        case '.':
          e.preventDefault()
          cycleSpeed(1)
          break
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          e.preventDefault()
          video.currentTime = (parseInt(e.key) / 10) * video.duration
          break
        case 'home':
          e.preventDefault()
          video.currentTime = 0
          break
        case 'end':
          e.preventDefault()
          video.currentTime = video.duration
          break
      }
      resetControlsTimeout()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFocused, resetControlsTimeout])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setIsMuted(video.muted)
  }

  const adjustVolume = (delta: number) => {
    const video = videoRef.current
    if (!video) return
    const newVolume = Math.max(0, Math.min(1, volume + delta))
    video.volume = newVolume
    setVolume(newVolume)
    if (newVolume > 0 && isMuted) {
      video.muted = false
      setIsMuted(false)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return
    const newVolume = parseFloat(e.target.value)
    video.volume = newVolume
    setVolume(newVolume)
    if (newVolume > 0 && isMuted) {
      video.muted = false
      setIsMuted(false)
    }
  }

  const seekBy = (seconds: number) => {
    const video = videoRef.current
    if (!video) return
    video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds))
  }

  const toggleFullscreen = async () => {
    const container = containerRef.current
    if (!container) return

    try {
      if (!document.fullscreenElement) {
        await container.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch {
      // Fullscreen not supported or denied
    }
  }

  const togglePiP = async () => {
    const video = videoRef.current
    if (!video || !document.pictureInPictureEnabled) return

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture()
      } else {
        await video.requestPictureInPicture()
      }
    } catch {
      // PiP not supported or denied
    }
  }

  const handleSpeedChange = (speed: number) => {
    const video = videoRef.current
    if (!video) return
    video.playbackRate = speed
    setPlaybackSpeed(speed)
    setShowSpeedMenu(false)
  }

  const cycleSpeed = (direction: number) => {
    const currentIndex = PLAYBACK_SPEEDS.indexOf(playbackSpeed)
    const newIndex = Math.max(0, Math.min(PLAYBACK_SPEEDS.length - 1, currentIndex + direction))
    handleSpeedChange(PLAYBACK_SPEEDS[newIndex])
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current
    if (!video) return
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    video.currentTime = percent * video.duration
  }

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX className="h-5 w-5" />
    if (volume < 0.5) return <Volume1 className="h-5 w-5" />
    return <Volume2 className="h-5 w-5" />
  }

  return (
    <div
      ref={containerRef}
      className={cn('group relative overflow-hidden rounded-xl bg-black', className)}
      onMouseEnter={() => resetControlsTimeout()}
      onMouseMove={() => resetControlsTimeout()}
      onMouseLeave={() => {
        if (isPlaying) {
          setShowControls(false)
          setShowSpeedMenu(false)
          setShowVolumeSlider(false)
        }
      }}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      tabIndex={0}
      role="application"
      aria-label="Video player. Press K or Space to play/pause, J/L or arrows to seek, M to mute, F for fullscreen."
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline
        className="h-full w-full object-contain"
        onClick={togglePlay}
      />

      {/* Play overlay for initial state */}
      {!isPlaying && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity"
          aria-label="Play video"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-500 text-white shadow-lg transition-transform hover:scale-110">
            <Play className="h-10 w-10 pl-1" fill="currentColor" />
          </div>
        </button>
      )}

      {/* Controls */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-10 transition-opacity',
          showControls ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
      >
        {/* Progress bar */}
        <div
          className="group/progress mb-3 h-1.5 cursor-pointer rounded-full bg-white/30 transition-all hover:h-2"
          onClick={handleProgressClick}
          role="slider"
          aria-label="Video progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
        >
          {/* Buffered */}
          <div
            className="absolute h-full rounded-full bg-white/40"
            style={{ width: `${buffered}%` }}
          />
          {/* Progress */}
          <div
            className="relative h-full rounded-full bg-primary-500 transition-all"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 translate-x-1/2 rounded-full bg-primary-400 opacity-0 shadow transition-opacity group-hover/progress:opacity-100" />
          </div>
        </div>

        {/* Control buttons */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            {/* Skip back */}
            <button
              onClick={() => seekBy(-SEEK_SECONDS)}
              className="rounded p-1.5 text-white transition-colors hover:bg-white/20"
              aria-label={`Skip back ${SEEK_SECONDS} seconds`}
            >
              <SkipBack className="h-5 w-5" />
            </button>

            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="rounded p-1.5 text-white transition-colors hover:bg-white/20"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </button>

            {/* Skip forward */}
            <button
              onClick={() => seekBy(SEEK_SECONDS)}
              className="rounded p-1.5 text-white transition-colors hover:bg-white/20"
              aria-label={`Skip forward ${SEEK_SECONDS} seconds`}
            >
              <SkipForward className="h-5 w-5" />
            </button>

            {/* Volume */}
            <div
              className="relative flex items-center"
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
            >
              <button
                onClick={toggleMute}
                className="rounded p-1.5 text-white transition-colors hover:bg-white/20"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {getVolumeIcon()}
              </button>
              <div
                className={cn(
                  'ml-1 flex items-center overflow-hidden transition-all duration-200',
                  showVolumeSlider ? 'w-20 opacity-100' : 'w-0 opacity-0'
                )}
              >
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/30 accent-primary-500"
                  aria-label="Volume"
                />
              </div>
            </div>

            {/* Time display */}
            <span className="ml-2 text-xs text-white/90 tabular-nums">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* Playback speed */}
            <div className="relative">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="flex items-center gap-1 rounded px-2 py-1.5 text-sm text-white transition-colors hover:bg-white/20"
                aria-label="Playback speed"
                aria-expanded={showSpeedMenu}
              >
                <Settings className="h-4 w-4" />
                <span className="text-xs">{playbackSpeed}x</span>
              </button>
              {showSpeedMenu && (
                <div className="absolute bottom-full right-0 mb-2 rounded-lg bg-warm-900/95 py-1 shadow-lg backdrop-blur">
                  {PLAYBACK_SPEEDS.map((speed) => (
                    <button
                      key={speed}
                      onClick={() => handleSpeedChange(speed)}
                      className={cn(
                        'block w-full px-4 py-1.5 text-left text-sm transition-colors',
                        speed === playbackSpeed
                          ? 'bg-primary-500/20 text-primary-400'
                          : 'text-white hover:bg-white/10'
                      )}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Picture-in-Picture */}
            {pipSupported && (
              <button
                onClick={togglePiP}
                className={cn(
                  'rounded p-1.5 text-white transition-colors hover:bg-white/20',
                  isPiP && 'text-primary-400'
                )}
                aria-label={isPiP ? 'Exit picture-in-picture' : 'Enter picture-in-picture'}
              >
                <PictureInPicture2 className="h-5 w-5" />
              </button>
            )}

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="rounded p-1.5 text-white transition-colors hover:bg-white/20"
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Keyboard shortcuts hint (shown on focus) */}
      {isFocused && showControls && (
        <div className="absolute left-4 top-4 rounded bg-black/60 px-2 py-1 text-xs text-white/70">
          Space: Play/Pause | ←→: Seek | ↑↓: Volume | M: Mute | F: Fullscreen
        </div>
      )}
    </div>
  )
}
