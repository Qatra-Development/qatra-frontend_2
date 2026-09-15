import type { InstitutionVerifier } from "../../types/institutions.types";

import {
  getInitial,
  getReviewerImage,
  getReviewerName,
} from "../lib/review.utils";

interface Props {
  verifier: InstitutionVerifier | null;
}

export default function ReviewerIdentity({ verifier }: Props) {
  const name = getReviewerName(verifier);

  const image = getReviewerImage(verifier);

  return (
    <div className="flex items-center gap-2">
      {image ? (
        <img
          src={image}
          alt={name}
          className="
            h-6 w-6
            rounded-full
            object-cover
          "
        />
      ) : (
        <span
          className="
            flex h-6 w-6
            items-center
            justify-center
            rounded-full
            bg-[#f1e5e8]
            text-[10px]
            font-bold
            text-[var(--admin-danger)]
          "
        >
          {getInitial(name)}
        </span>
      )}

      <span>{name}</span>
    </div>
  );
}
