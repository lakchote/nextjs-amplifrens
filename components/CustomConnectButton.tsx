import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useContractRead, useDisconnect, useSwitchNetwork } from "wagmi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightArrowLeft, faEye, faSignOut, faUserCircle, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useProfileContext } from "../pages/_app";
import Link from "next/link";
import addressesJson from "../constants/addresses.json";
import facadeAbi from "../constants/abi.json";
import Image from "next/image";

export default function CustomConnectButton() {
  const { switchNetwork } = useSwitchNetwork();
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
      {({ account, chain, mounted, openConnectModal }) => {
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
                  <button onClick={openConnectModal} type="button" className="flex items-center mr-3 lg:mr-28">
                    <Image src="/images/metamask.svg" width={25} height={25} alt="Connect Wallet" />
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={() => switchNetwork?.(parseInt(process.env.NEXT_PUBLIC_CHAIN_ID!))}
                    type="button"
                    className="cursor-pointer flex items-center mr-3 lg:mr-28"
                  >
                    <FontAwesomeIcon className="text-accent" icon={faArrowRightArrowLeft} size="lg" />
                  </button>
                );
              }

              return (
                <div className="dropdown dropdown-end rounded-full">
                  <label tabIndex={0} className="cursor-pointer mr-3 lg:mr-28" onClick={() => setDropdownOpen(true)}>
                    <FontAwesomeIcon className="text-accent-content" icon={faUserCircle} size="xl" />
                  </label>
                  <ul
                    tabIndex={0}
                    className={`${
                      !dropdownOpen ? "hidden" : ""
                    } dropdown-content menu p-2 shadow bg-accent text-neutral rounded-box w-52`}
                  >
                    {profileUpdated ?? (hasUserProfile && address) ? (
                      <>
                        <li>
                          <Link href={`/profile/${encodeURIComponent(address!)}`}>
                            <a className="hover:bg-accent-focus" onClick={() => setDropdownOpen(false)}>
                              <FontAwesomeIcon icon={faEye} />
                              Show profile
                            </a>
                          </Link>
                        </li>
                      </>
                    ) : (
                      <li>
                        <Link href="/profile/create">
                          <a className="hover:bg-accent-focus" onClick={() => setDropdownOpen(false)}>
                            <FontAwesomeIcon icon={faUserPlus} />
                            Create profile
                          </a>
                        </Link>
                      </li>
                    )}
                    <li>
                      <a className="hover:bg-accent-focus" onClick={() => disconnect()}>
                        <FontAwesomeIcon icon={faSignOut} />
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
