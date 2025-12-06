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
  <div className="grid gap-4">
    {/* Fixed-size QR Scanner Container */}
    <div className="w-full rounded-xl border-2 border-dashed border-muted-foreground/50 bg-gradient-to-br from-muted to-background p-4 shadow-lg">
      <div className="aspect-[4/3] min-h-[320px] max-h-[480px] w-full mx-auto rounded-xl bg-black/20 border-4 border-dashed border-white/30">
        <div 
          id="qr-reader" 
          className="w-full h-full rounded-xl"
          style={{ 
            minHeight: '320px',
            maxHeight: '480px'
          }}
        />
      </div>
    </div>
    
    {/* Status - Larger & clearer */}
    <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 border rounded-xl text-center shadow-sm">
      <div className="text-lg font-semibold text-primary-foreground mb-1">
        {status === "starting" ? "🔄 Initializing..." : 
         status === "scanning" ? "📷 Ready to scan" : "⏸️ Paused"}
      </div>
      <div className="text-sm text-muted-foreground">
        {status === "scanning" ? "Hold QR code steady in frame" : "Grant camera permission if prompted"}
      </div>
    </div>

    {error && (
      <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-xl text-sm text-destructive font-medium">
        ⚠️ {error}
      </div>
    )}

    {/* Manual input - Full width */}
    <div className="grid gap-3 p-4 bg-muted/20 rounded-xl border">
      <div className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
        <span>OR enter manually</span>
        <span className="px-2 py-1 bg-muted text-xs rounded-full font-mono">
          ATH123456
        </span>
      </div>
      <div className="flex gap-3">
        <input
          value={manual}
          onChange={(e) => setManual(e.target.value)}
          placeholder="e.g. ATH123456"
          className="h-14 flex-1 rounded-xl border-2 bg-background px-5 text-lg font-medium ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:border-ring"
          onKeyDown={(e) => e.key === "Enter" && handleManualSubmit()}
        />
        <button
          type="button"
          onClick={handleManualSubmit}
          disabled={!manual.trim()}
          className="h-14 px-8 rounded-xl bg-primary text-primary-foreground text-lg font-semibold shadow-lg hover:bg-primary/95 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          Add Athlete
        </button>
      </div>
    </div>
  </div>
)

}
