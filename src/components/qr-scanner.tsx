"use client"

import { useEffect, useRef, useState } from "react"

type Props = {
  onDetected: (text: string) => void
}

export function QRScanner({ onDetected }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [supported, setSupported] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [manual, setManual] = useState("")

  useEffect(() => {
  let stream: MediaStream | null = null
  let stopped = false
  async function init() {
    try {
      console.log("🔍 QRScanner: Starting camera...")
      
      // ✅ ALWAYS try camera FIRST (works on laptop/mobile)
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      })
      
      if (!videoRef.current) return
      videoRef.current.srcObject = stream
      await videoRef.current.play()
      console.log("✅ QRScanner: Camera stream active")
      
      // NOW check BarcodeDetector (optional)
      const hasDetector = typeof window !== "undefined" && window.BarcodeDetector
      if (!hasDetector) {
        console.log("⚠️ QRScanner: No BarcodeDetector, camera preview only")
        setSupported(false)  // Manual input available, but SHOWS camera video
        return
      }
      
      setSupported(true)
      // @ts-expect-error
      const detector = new window.BarcodeDetector({ formats: ["qr_code"] })
      
      const track = stream.getVideoTracks()[0]
      const imageCapture = "ImageCapture" in window ? new (window as any).ImageCapture(track) : null

      async function tick() {
        if (stopped) return
        try {
          let bitmap: ImageBitmap | null = null
          if (imageCapture && imageCapture.grabFrame) {
            bitmap = await imageCapture.grabFrame()
          } else if (videoRef.current) {
            // @ts-ignore
            bitmap = await createImageBitmap(videoRef.current)
          }
          if (bitmap) {
            const codes = await detector.detect(bitmap)
            if (codes && codes[0]?.rawValue) {
              onDetected(codes[0].rawValue)
            }
            bitmap.close?.()
          }
        } catch (e) {
          // non-fatal
        } finally {
          setTimeout(tick, 350)
        }
      }
      tick()
      
    } catch (e: any) {
      console.error("❌ QRScanner Camera error:", e.name, e.message)
      setError(e?.message || "Camera access failed")
    }
  }
  init()
  return () => {
    stopped = true
    if (stream) {
      stream.getTracks().forEach((t) => t.stop())
    }
  }
}, [onDetected])


  return (
  <div className="grid gap-3">
    <div className="rounded-md border bg-background p-2">
      {/* ✅ ALWAYS show video when stream exists */}
      {videoRef.current?.srcObject ? (
        <video 
          ref={videoRef} 
          playsInline 
          muted 
          autoPlay
          className="w-full aspect-video rounded-md bg-muted object-cover"
        />
      ) : error ? (
        <div className="text-sm text-destructive p-4 text-center">
          {error}
        </div>
      ) : (
        <div className="flex items-center justify-center h-48 bg-muted rounded-md">
          <span className="text-sm text-muted-foreground">Initializing camera...</span>
        </div>
      )}
    </div>
    
    {/* Status indicator */}
    <div className="p-2 bg-muted/50 rounded-md text-xs text-muted-foreground text-center">
      {supported === null ? "Starting..." : 
       supported ? "✅ QR scanning active" : "📷 Camera preview + manual input"}
    </div>

    {error && (
      <div className="p-2 bg-red-50 border border-red-200 rounded-md text-sm text-destructive">
        {error}
      </div>
    )}

    <label className="grid gap-2">
      <span className="text-sm font-medium">Manual QR / ID</span>
      <div className="flex gap-2">
        <input
          value={manual}
          onChange={(e) => setManual(e.target.value)}
          placeholder="e.g. ATH123456"
          className="h-10 flex-1 rounded-md border bg-background px-3 text-sm"
        />
        <button
          type="button"
          onClick={() => manual && onDetected(manual)}
          disabled={!manual.trim()}
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          Add
        </button>
      </div>
    </label>
  </div>
)
}