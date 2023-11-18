import '@/styles/globals.css'
import { APP_NAME } from '@/lib/consts'
import type { AppProps } from 'next/app'
import { WagmiConfig, createConfig } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { ConnectKitProvider, getDefaultConfig } from 'connectkit'
import { polygon, optimism, arbitrum, baseGoerli } from "wagmi/chains";

// Choose which chains you'd like to show
const alchemyId = process.env.ALCHEMY_ID;
const walletConnectProjectId = process.env.WALLETCONNECT_PROJECT_ID ?? "";
const chains = [polygon, optimism, arbitrum, baseGoerli];

const config = createConfig(
  getDefaultConfig({
    appName: "zk Credit Score",
    alchemyId,
	walletConnectProjectId,
    chains,
}),
);

export default function App({ Component, pageProps }: AppProps) {
	return (
		<WagmiConfig config={config}>
			<ConnectKitProvider>
				<Component {...pageProps} />
			</ConnectKitProvider>
		</WagmiConfig>
	)
}