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
        {supported ? (
          <video ref={videoRef} playsInline muted className="w-full aspect-video rounded-md bg-muted" />
        ) : (
          <div className="text-sm text-muted-foreground p-4">
            Camera-based QR detection not supported. Paste the QR code content below.
          </div>
        )}
      </div>
      {error && <p className="text-destructive text-sm">{error}</p>}

      <label className="grid gap-2">
        <span className="text-sm">Manual QR / ID</span>
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
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground"
          >
            Add
          </button>
        </div>
      </label>
    </div>
  )
}
