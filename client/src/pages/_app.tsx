import '@/styles/globals.css'
import { APP_NAME } from '@/lib/consts'
import type { AppProps } from 'next/app'
import { WagmiConfig, createConfig } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { ConnectKitProvider, getDefaultConfig } from 'connectkit'
import { baseGoerli, scrollTestnet, celoAlfajores, mantleTestnet } from "wagmi/chains";

// Choose which chains you'd like to show
const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_ID;
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "";
const chains = [baseGoerli, scrollTestnet, celoAlfajores, mantleTestnet];

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