import ClaimSummaryClient from "./ClaimSummaryClient";

export function generateStaticParams() {
  return [{ id: "CLM-2026-0847" }];
}

export default function Page() {
  return <ClaimSummaryClient />;
}
