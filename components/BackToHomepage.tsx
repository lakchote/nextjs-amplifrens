import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function BackToHomepage() {
  return (
    <div className="my-2 flex justify-center">
      <Link href="/">
        <a className="text-secondary">
          <FontAwesomeIcon icon={faArrowAltCircleLeft} className="mr-1" />
          Go back to contributions
        </a>
      </Link>
    </div>
  );
}
