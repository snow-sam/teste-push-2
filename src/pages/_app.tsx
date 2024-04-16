import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { Analytics } from "@vercel/analytics/react"
import { MagicBellProvider } from "@magicbell/react-headless"
import { SubscriptionManager } from "@/services/subscriptionManager"
import { DeviceInfoProvider } from "@/hooks/useDeviceInfo"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <MagicBellProvider
        apiKey={"7f448c94e94201cfe85cb7426f7c764d4ce88bef"}
        userExternalId={SubscriptionManager.getOrSetUserId()}
      >
        <DeviceInfoProvider>
          <Component {...pageProps} />
        </DeviceInfoProvider>
      </MagicBellProvider>
      <Analytics />
    </>
  )
}
