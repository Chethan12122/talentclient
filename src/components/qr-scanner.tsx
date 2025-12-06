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
  <div className="grid gap-3 sm:gap-4">
    {/* Minimal QR reader – no outer camera screen */}
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[320px] sm:max-w-[360px]">
        <div
          id="qr-reader"
          className="w-full"
        />
      </div>
    </div>

    {/* Status (optional, keep or style as you like) */}
    <div className="p-3 sm:p-4 bg-gradient-to-r from-primary/10 to-primary/5 border rounded-xl text-center shadow-sm">
      <div className="text-sm sm:text-base md:text-lg font-semibold text-primary-foreground mb-1">
        {status === "starting" ? "🔄 Initializing scanner..." : 
         status === "scanning" ? "📷 Ready to scan QR code" : "⏸️ Scanner paused"}
      </div>
      <div className="text-xs sm:text-sm text-muted-foreground">
        {status === "scanning" ? "Hold QR code steady • 10–30 cm away" : "Allow camera access to start"}
      </div>
    </div>

    {error && (
      <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-xl text-sm text-destructive font-medium px-4">
        ⚠️ {error}
      </div>
    )}

    {/* Manual input – unchanged */}
    <div className="grid gap-2 p-3 sm:p-4 bg-muted/20 rounded-xl border">
      <div className="text-xs sm:text-sm font-semibold flex flex-col sm:flex-row sm:items-center sm:gap-2 text-muted-foreground">
        <span>OR enter athlete ID manually</span>
        <span className="px-2 py-0.5 bg-muted text-xs rounded-full font-mono">
          ATH123456
        </span>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <input
          value={manual}
          onChange={(e) => setManual(e.target.value)}
          placeholder="e.g. ATH123456"
          className="h-12 sm:h-14 flex-1 rounded-xl border-2 bg-background px-4 sm:px-5 text-base sm:text-lg font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none transition-all"
          onKeyDown={(e) => e.key === "Enter" && handleManualSubmit()}
        />
        <button
          type="button"
          onClick={handleManualSubmit}
          disabled={!manual.trim()}
          className="h-12 sm:h-14 px-6 sm:px-8 rounded-xl bg-primary text-primary-foreground text-sm sm:text-base font-semibold shadow-lg hover:bg-primary/95 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
        >
          Add Athlete
        </button>
      </div>
    </div>
  </div>
)



}
