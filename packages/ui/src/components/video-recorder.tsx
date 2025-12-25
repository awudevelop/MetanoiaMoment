'use client'

import * as React from 'react'
import { Video, Square, RotateCcw, Check, Camera, AlertCircle } from 'lucide-react'
import { cn } from '../lib/utils'
import { Button } from './button'

export interface VideoRecorderProps {
  onRecordingComplete: (blob: Blob) => void
  maxDuration?: number // in seconds
  className?: string
}

type RecordingState = 'idle' | 'permission' | 'ready' | 'recording' | 'preview' | 'error'

export function VideoRecorder({
  onRecordingComplete,
  maxDuration = 600, // 10 minutes default
  className,
}: VideoRecorderProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const previewRef = React.useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null)
  const streamRef = React.useRef<MediaStream | null>(null)
  const chunksRef = React.useRef<Blob[]>([])

  const [state, setState] = React.useState<RecordingState>('idle')
  const [recordedBlob, setRecordedBlob] = React.useState<Blob | null>(null)
  const [duration, setDuration] = React.useState(0)
  const [error, setError] = React.useState<string | null>(null)

  const durationIntervalRef = React.useRef<NodeJS.Timeout | null>(null)

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const requestPermission = async () => {
    setState('permission')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setState('ready')
    } catch {
      setError('Camera access is required to record your testimony')
      setState('error')
    }
  }

  const startRecording = () => {
    const stream = streamRef.current
    if (!stream) return

    chunksRef.current = []
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9,opus',
    })

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data)
      }
    }

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' })
      setRecordedBlob(blob)
      setState('preview')

      // Set up preview
      if (previewRef.current) {
        previewRef.current.src = URL.createObjectURL(blob)
      }
    }

    mediaRecorderRef.current = mediaRecorder
    mediaRecorder.start(1000) // Collect data every second
    setState('recording')
    setDuration(0)

    // Start duration counter
    durationIntervalRef.current = setInterval(() => {
      setDuration((prev) => {
        if (prev >= maxDuration) {
          stopRecording()
          return prev
        }
        return prev + 1
      })
    }, 1000)
  }

  const stopRecording = () => {
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current)
    }
    mediaRecorderRef.current?.stop()
  }

  const retake = () => {
    setRecordedBlob(null)
    setState('ready')
    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current
    }
  }

  const confirmRecording = () => {
    if (recordedBlob) {
      onRecordingComplete(recordedBlob)
    }
  }

  React.useEffect(() => {
    return () => {
      // Cleanup
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current)
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  return (
    <div className={cn('flex flex-col items-center', className)}>
      {/* Video display */}
      <div className="relative mb-6 aspect-video w-full max-w-2xl overflow-hidden rounded-xl bg-warm-900">
        {state === 'idle' && (
          <div className="flex h-full flex-col items-center justify-center text-warm-400">
            <Camera className="mb-4 h-16 w-16" />
            <p className="text-lg">Click below to enable your camera</p>
          </div>
        )}

        {state === 'permission' && (
          <div className="flex h-full flex-col items-center justify-center text-warm-400">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
            <p className="mt-4 text-lg">Requesting camera access...</p>
          </div>
        )}

        {state === 'error' && (
          <div className="flex h-full flex-col items-center justify-center text-red-400">
            <AlertCircle className="mb-4 h-16 w-16" />
            <p className="text-lg">{error}</p>
            <Button variant="outline" onClick={requestPermission} className="mt-4">
              Try Again
            </Button>
          </div>
        )}

        {(state === 'ready' || state === 'recording') && (
          <>
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="h-full w-full object-cover"
            />
            {state === 'recording' && (
              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-lg bg-red-600 px-3 py-1.5 text-white">
                <div className="h-3 w-3 animate-pulse rounded-full bg-white" />
                <span className="font-medium">{formatDuration(duration)}</span>
              </div>
            )}
          </>
        )}

        {state === 'preview' && (
          <video
            ref={previewRef}
            controls
            playsInline
            className="h-full w-full object-cover"
          />
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        {state === 'idle' && (
          <Button onClick={requestPermission} size="lg">
            <Camera className="mr-2 h-5 w-5" />
            Enable Camera
          </Button>
        )}

        {state === 'ready' && (
          <Button onClick={startRecording} size="lg" className="bg-red-600 hover:bg-red-700">
            <Video className="mr-2 h-5 w-5" />
            Start Recording
          </Button>
        )}

        {state === 'recording' && (
          <Button onClick={stopRecording} size="lg" variant="outline">
            <Square className="mr-2 h-5 w-5" fill="currentColor" />
            Stop Recording
          </Button>
        )}

        {state === 'preview' && (
          <>
            <Button onClick={retake} size="lg" variant="outline">
              <RotateCcw className="mr-2 h-5 w-5" />
              Record Again
            </Button>
            <Button onClick={confirmRecording} size="lg">
              <Check className="mr-2 h-5 w-5" />
              Use This Recording
            </Button>
          </>
        )}
      </div>

      {/* Duration limit notice */}
      {state === 'recording' && (
        <p className="mt-4 text-sm text-warm-500">
          Maximum recording time: {formatDuration(maxDuration)}
        </p>
      )}
    </div>
  )
}
