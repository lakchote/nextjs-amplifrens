import { ReadContractResult } from "@wagmi/core";

export default function ShowProfileSocialHandles({ socialHandles }: { socialHandles: ReadContractResult }) {
  return (
    <div className="flex lg:flex-row lg:space-x-6 space-x-4">
      {socialHandles.lensHandle && (
        <>
          <a href={`https://lenster.xyz/u/${socialHandles.lensHandle}`} className="flex flex-col hover:text-neutral">
            <span>🌿</span>
            <span>Lens</span>
          </a>
        </>
      )}
      {socialHandles.twitterHandle && (
        <>
          <a
            className="flex flex-col hover:text-neutral"
            href={`https://www.twitter.com/${socialHandles.twitterHandle}`}
          >
            <span>🐦</span>
            <span>Twitter</span>
          </a>
        </>
      )}
      {socialHandles.discordHandle && (
        <>
          <a
            className="flex flex-col cursor-pointer hover:text-neutral"
            onClick={(e) => {
              navigator.clipboard.writeText(socialHandles.discordHandle);
              e.currentTarget.innerHTML = "<span>🤖</span><span>Copied to clipboard!</span>";
              e.currentTarget.classList.add("text-accent-content");
            }}
          >
            <span>🤖</span>
            <span>Discord</span>
          </a>
        </>
      )}
      {socialHandles.websiteUrl && (
        <>
          <a className="flex flex-col hover:text-neutral" href={socialHandles.websiteUrl}>
            <span>🌐</span>
            <span>Website</span>
          </a>
        </>
      )}
      {socialHandles.email && (
        <>
          <a className="flex flex-col hover:text-neutral" href={`mailto:${socialHandles.email}`}>
            <span>✉️ </span>
            <span>Email</span>
          </a>
        </>
      )}
    </div>
  );
}
