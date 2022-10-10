import "../styles/globals.css";
import type { AppProps } from "next/app";
import Header from "../components/Header";
import { WagmiConfig, createClient, chain } from "wagmi";
import { ConnectKitProvider, getDefaultClient } from "connectkit";

const chains = [chain.polygonMumbai];

const client = createClient(
  getDefaultClient({
    appName: process.env.INFURA_APP_NAME!,
    infuraId: process.env.INFURA_API_KEY!,
    chains: chains
  })
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider>
        <Header />
        <Component {...pageProps} />
      </ConnectKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
