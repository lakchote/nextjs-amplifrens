import type { AppProps } from "next/app";
import Header from "../components/Header";
import { darkTheme, getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiConfig, createClient, chain, configureChains } from "wagmi";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { config } from "@fortawesome/fontawesome-svg-core";
import { infuraProvider } from "wagmi/providers/infura";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { ToastContainer } from "react-toastify";
import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "react-toastify/dist/ReactToastify.min.css";

config.autoAddCss = false;

const graphqlClient = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          contributionDownvoteds: {
            merge: false,
          },
          contributionUpvoteds: {
            merge: false,
          },
        },
      },
    },
  }),
  uri: process.env.NEXT_PUBLIC_SUBGRAPH_URL,
});

const { chains, provider } = configureChains(
  [chain.hardhat, chain.polygon, chain.polygonMumbai],
  [
    infuraProvider({ apiKey: process.env.INFURA_API_KEY }),
    jsonRpcProvider({
      rpc: () => ({ http: process.env.RPC_LOCAL_NODE_URL! }),
    }),
  ]
);
const { connectors } = getDefaultWallets({
  appName: process.env.APP_NAME!,
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <ApolloProvider client={graphqlClient}>
        <RainbowKitProvider chains={chains} theme={darkTheme({ accentColor: "#828DF8" })}>
          <Header />
          <ToastContainer theme="dark" />
          <Component {...pageProps} />
        </RainbowKitProvider>
      </ApolloProvider>
    </WagmiConfig>
  );
}

export default MyApp;
