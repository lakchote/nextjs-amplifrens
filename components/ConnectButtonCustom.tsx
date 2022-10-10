import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { ConnectKitButton } from "connectkit";
import { useEffect } from "react";

export default function ConnectButtonCustom() {
  const { chain } = useNetwork();
  const { isConnected } = useAccount();
  const { switchNetwork } = useSwitchNetwork();
  const supportedChain = Number(process.env.NEXT_PUBLIC_SUPPORTED_CHAIN_ID!);

  useEffect(() => {
    if (isConnected) {
      if (chain?.id !== supportedChain) {
        switchNetwork?.(supportedChain);
      }
    }
  }, [isConnected]);

  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress, ensName }) => {
        return (
          <button
            className={
              isConnected
                ? "btn btn-neutral btn-sm md:btn-md hover:bg-accent-focus hover:border-white hover:text-white"
                : "btn btn-neutral btn-sm md:btn-md hover:bg-accent-focus hover:text-white hover:border-white"
            }
            onClick={show}
          >
            {isConnected ? ensName ?? truncatedAddress : "Connect"}
          </button>
        );
      }}
    </ConnectKitButton.Custom>
  );
}
