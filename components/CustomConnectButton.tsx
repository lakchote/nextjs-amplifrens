import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useContractRead, useDisconnect } from "wagmi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useProfileContext } from "../pages/_app";
import Link from "next/link";
import addressesJson from "../constants/addresses.json";
import facadeAbi from "../constants/abi.json";

export default function CustomConnectButton() {
  const { profileUpdated } = useProfileContext();
  const { disconnect } = useDisconnect();
  const { address } = useAccount();
  const { data: hasUserProfile } = useContractRead({
    addressOrName: addressesJson[process.env.NEXT_PUBLIC_CHAIN_ID as keyof typeof addressesJson].address,
    contractInterface: facadeAbi,
    functionName: "hasUserProfile",
    args: address,
    enabled: Boolean(address),
  });

  const { data: profileInfo } = useContractRead({
    addressOrName: addressesJson[process.env.NEXT_PUBLIC_CHAIN_ID as keyof typeof addressesJson].address,
    contractInterface: facadeAbi,
    functionName: "getUserProfile",
    args: address,
    enabled: Boolean(hasUserProfile),
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <ConnectButton.Custom>
      {({ account, chain, mounted, openChainModal, openConnectModal }) => {
        const connected = account && chain && mounted;
        return (
          <div
            {...(!mounted && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button onClick={openConnectModal} type="button" className="btn btn-neutral btn-sm lg:btn-md">
                    Connect
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button" className="btn btn-accent btn-sm lg:btn-md">
                    Wrong network
                  </button>
                );
              }

              return (
                <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="btn m-1" onClick={() => setDropdownOpen(true)}>
                    <FontAwesomeIcon icon={faUserCircle} size="xl" className="text-secondary mr-1" />
                    {profileUpdated ? profileUpdated : hasUserProfile ? profileInfo?.username : account.displayName}
                  </label>
                  <ul
                    tabIndex={0}
                    className={`${
                      !dropdownOpen ? "hidden" : ""
                    } dropdown-content menu p-2 shadow bg-neutral rounded-box w-52`}
                  >
                    {profileUpdated ?? hasUserProfile ? (
                      <>
                        <li>
                          <Link href={`/profile/${encodeURIComponent(profileUpdated ?? profileInfo?.username)}`}>
                            <a className="hover:text-white" onClick={() => setDropdownOpen(false)}>
                              Show profile
                            </a>
                          </Link>
                        </li>
                      </>
                    ) : (
                      <li>
                        <Link href="/profile/create">
                          <a className="hover:text-white" onClick={() => setDropdownOpen(false)}>
                            Create profile
                          </a>
                        </Link>
                      </li>
                    )}
                    <div className="divider my-1"></div>
                    <li>
                      <a className="btn btn-sm btn-accent text-white align-top p-1" onClick={() => disconnect()}>
                        Disconnect
                      </a>
                    </li>
                  </ul>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
