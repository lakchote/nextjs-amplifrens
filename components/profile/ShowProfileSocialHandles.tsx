import { ReadContractResult } from "@wagmi/core";

export default function ShowProfileSocialHandles({ socialHandles }: { socialHandles: ReadContractResult }) {
  return (
    <div className="flex flex-col">
      {socialHandles.lensHandle && (
        <>
          <a className="btn btn-default mt-3" href={`https://lenster.xyz/u/${socialHandles.lensHandle}`}>
            🌿 Lens
          </a>
        </>
      )}
      {socialHandles.twitterHandle && (
        <>
          <a className="btn btn-default mt-3" href={`https://www.twitter.com/${socialHandles.twitterHandle}`}>
            🐦 Twitter
          </a>
        </>
      )}
      {socialHandles.discordHandle && (
        <>
          <span
            className="btn btn-default mt-3"
            onClick={(e) => {
              navigator.clipboard.writeText(e.currentTarget.innerText.slice(2));
            }}
          >
            🤖 {socialHandles.discordHandle}{" "}
          </span>
        </>
      )}
      {socialHandles.websiteUrl && (
        <>
          <a className="btn btn-default mt-3" href={socialHandles.websiteUrl}>
            🌐 Website
          </a>
        </>
      )}
      {socialHandles.email && (
        <>
          <a className="btn btn-default mt-3" href={`mailto:${socialHandles.email}`}>
            ✉️ Email
          </a>
        </>
      )}
    </div>
  );
}
