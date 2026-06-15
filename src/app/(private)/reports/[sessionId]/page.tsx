import DetailedReport from "@/components/pages/Reports/DetailedReport";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function ReportDetailPage(props: any) {
  // Await params to support Next.js 15, fallback to object for Next.js 14
  const params = await Promise.resolve(props.params);
  const sessionId = params?.sessionId;
  
  if (!sessionId) return null;
  return <DetailedReport sessionId={sessionId} />;
}
