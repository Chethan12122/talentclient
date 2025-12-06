"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Html5QrcodeScanner } from "html5-qrcode"

type Props = {
  onDetected: (text: string) => void
}

export function QRScanner({ onDetected }: Props) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<"starting" | "scanning" | "paused">("starting")
  const [manual, setManual] = useState("")

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader", 
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    )
    
    scanner.render(
      (decodedText) => {
        onDetected(decodedText)
        setStatus("scanning")
      },
      (err) => {
        console.warn("QR scan error:", err)
      }
    )
    
    scannerRef.current = scanner
    setStatus("scanning")
    
    return () => {
      scanner.clear()
    }
  }, [onDetected])

  const handleManualSubmit = useCallback(() => {
    if (manual.trim()) {
      onDetected(manual.trim())
      setManual("")
    }
  }, [manual, onDetected])

  return (
    <div className="grid gap-3">
      {/* QR Scanner */}
      <div className="aspect-video rounded-md border bg-background overflow-hidden">
        <div 
          id="qr-reader" 
          className="w-full h-full"
        />
      </div>
      
      {/* Status */}
      <div className="p-2 bg-muted/50 rounded-md text-xs text-center text-muted-foreground">
        {status === "starting" ? "Starting scanner..." : 
         status === "scanning" ? "📷 Point camera at QR code" : 
         "Paused"}
      </div>

      {error && (
        <div className="p-2 bg-red-50 border border-red-200 rounded-md text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Manual input */}
      <label className="grid gap-2">
        <span className="text-sm font-medium">Manual QR / ID</span>
        <div className="flex gap-2">
          <input
            value={manual}
            onChange={(e) => setManual(e.target.value)}
            placeholder="e.g. ATH123456"
            className="h-10 flex-1 rounded-md border bg-background px-3 text-sm"
            onKeyDown={(e) => e.key === "Enter" && handleManualSubmit()}
          />
          <button
            type="button"
            onClick={handleManualSubmit}
            disabled={!manual.trim()}
            className="h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90"
          >
            Add
          </button>
        </div>
      </label>
    </div>
  )
}
