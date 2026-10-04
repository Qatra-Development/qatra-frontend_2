"use client";

import { useEffect, useState } from "react";
import BloodBankInventory from "../../BloodBankDashboard/components/BloodInventory";
import { bankApi, type BloodDashboard } from "../lib/api";

export default function BloodInventory() {
  const [dashboard, setDashboard] = useState<BloodDashboard | null>(null);
  useEffect(() => {
    const load = () => { void bankApi<BloodDashboard>("/dashboard").then(result => setDashboard(result.data)).catch(() => setDashboard(null)); };
    load();
    window.addEventListener("hospital:inventory-changed", load);
    return () => window.removeEventListener("hospital:inventory-changed", load);
  }, []);
  return <BloodBankInventory dashboard={dashboard} />;
}
