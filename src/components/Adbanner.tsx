import { useSession } from "@/lib/session" // ή το path που έχεις για το session
import { useEffect, useState } from "react"

export default function FunderProAd() {
  const { session } = useSession()
  const [showAd, setShowAd] = useState(false)

  useEffect(() => {
    if (session?.user?.role === "user") {
      setShowAd(true)
    }
  }, [session])

  if (!showAd) return null

  return (
    <div className="text-center mt-6">
      <a href="https://funderpro.cxclick.com/visit/?bta=37087&nci=5350" target="_blank" rel="noopener noreferrer">
        <img
          src="https://funderpro.ck-cdn.com/tn/serve/?cid=366622"
          alt="FunderPro"
          className="mx-auto max-w-[320px] border rounded shadow"
        />
      </a>
    </div>
  )
}
