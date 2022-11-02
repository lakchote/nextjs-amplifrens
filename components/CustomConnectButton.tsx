import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useContractRead, useDisconnect, useSwitchNetwork } from "wagmi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightArrowLeft,
  faSignOut,
  faUserAstronaut,
  faUserCircle,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useProfileContext } from "../pages/_app";
import Link from "next/link";
import addressesJson from "../constants/addresses.json";
import facadeAbi from "../constants/abi.json";

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
                  <button onClick={openConnectModal} type="button" className="btn btn-primary btn-sm mt-0">
                    <FontAwesomeIcon icon={faUserAstronaut} className="mr-1" />
                    Connect
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={() => switchNetwork?.(parseInt(process.env.NEXT_PUBLIC_CHAIN_ID!))}
                    type="button"
                    className="btn btn-primary btn-sm"
                  >
                    <FontAwesomeIcon icon={faArrowRightArrowLeft} className="mr-1" />
                    Switch network
                  </button>
                );
              }

              return (
                <div className="dropdown dropdown-end ">
                  <label tabIndex={0} className="btn bg-neutral-focus" onClick={() => setDropdownOpen(true)}>
                    <FontAwesomeIcon icon={faUserCircle} size="xl" className="mr-1" />
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
                            <a className="hover:bg-neutral-focus" onClick={() => setDropdownOpen(false)}>
                              Show profile
                            </a>
                          </Link>
                        </li>
                      </>
                    ) : (
                      <li>
                        <Link href="/profile/create">
                          <a className="hover:bg-neutral-focus" onClick={() => setDropdownOpen(false)}>
                            <FontAwesomeIcon icon={faUserPlus} />
                            Create profile
                          </a>
                        </Link>
                      </li>
                    )}
                    <li>
                      <a className="hover:bg-neutral-focus" onClick={() => disconnect()}>
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
