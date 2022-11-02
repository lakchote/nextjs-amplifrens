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
import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

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
      rpc: () => ({ http: process.env.RPC_NODE_URL! }),
    }),
  ]
);
const { connectors } = getDefaultWallets({
  appName: process.env.APP_NAME!,
  chains,
});

const wagmiClient = createClient({
  autoConnect: false,
  connectors,
  provider,
});

const ProfileContext = createContext<{
  profileUpdated: string | null;
  setProfileUsername: Dispatch<SetStateAction<string | null>>;
}>({
  profileUpdated: null,
  setProfileUsername: () => undefined,
});

function MyApp({ Component, pageProps }: AppProps) {
  const [profileUpdated, setProfileUsername] = useState<string | null>(null);

  return (
    <WagmiConfig client={wagmiClient}>
      <ApolloProvider client={graphqlClient}>
        <RainbowKitProvider modalSize="compact" chains={chains} theme={darkTheme({ accentColor: "#3abff8" })}>
          <ProfileContext.Provider value={{ profileUpdated: profileUpdated, setProfileUsername }}>
            <div data-theme="night">
              <Header />
              <ToastContainer theme="dark" />
              <Component {...pageProps} />
            </div>
          </ProfileContext.Provider>
        </RainbowKitProvider>
      </ApolloProvider>
    </WagmiConfig>
  );
}

export default MyApp;
export const useProfileContext = () => useContext(ProfileContext);
