import '@/styles/globals.css'
import { APP_NAME } from '@/lib/consts'
import type { AppProps } from 'next/app'
import { WagmiConfig, createClient, configureChains, mainnet } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { ConnectKitProvider, getDefaultClient } from 'connectkit'

const { chains, publicClient, webSocketPublicClient } = configureChains(
	[mainnet],
	[alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()],
  )

export default function App({ Component, pageProps }: AppProps) {
	return (
		<WagmiConfig client={publicClient}>
			<ConnectKitProvider>
				<Component {...pageProps} />
			</ConnectKitProvider>
		</WagmiConfig>
	)
}
