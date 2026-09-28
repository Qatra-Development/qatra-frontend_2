import { Check } from "lucide-react";

import { REQUEST_PROGRESS_STEPS } from "../config/blood-request.config";

import { formatRequestDateTime } from "../lib/blood-request.utils";

import type {
  BloodRequestDetails,
  BloodRequestHistory,
} from "../types/blood-request.types";

import styles from "../blood-requests.module.css";

interface Props {
  request: BloodRequestDetails;
}

function findStatusEvent(history: BloodRequestHistory[], status: string) {
  return history.find((event) => event.to_status === status);
}

export function BloodRequestProgress({ request }: Props) {
  const normalStatuses = REQUEST_PROGRESS_STEPS.map((step) => step.status);

  const currentIndex = normalStatuses.indexOf(
    request.status as (typeof normalStatuses)[number],
  );

  return (
    <div className={styles.progressCard}>
      {REQUEST_PROGRESS_STEPS.map((step, index) => {
        const event = findStatusEvent(request.status_history, step.status);

        const reached =
          Boolean(event) || (currentIndex >= 0 && index <= currentIndex);

        return (
          <div key={step.status} className={styles.progressItem}>
            <div
              className={`${styles.progressCircle} ${
                reached ? styles.progressCircleReached : ""
              }`}
            >
              {reached ? <Check size={16} /> : index + 1}
            </div>

            <strong>{step.label}</strong>

            <small>
              {event ? formatRequestDateTime(event.created_at) : ""}
            </small>

            {index < REQUEST_PROGRESS_STEPS.length - 1 ? (
              <span className={styles.progressLine} />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
