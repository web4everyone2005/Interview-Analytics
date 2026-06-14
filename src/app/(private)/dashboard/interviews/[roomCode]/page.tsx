import HRRoom from "@/components/features/interviews/HRRoom";

export const metadata = {
  title: "Điều khiển Phỏng Vấn | Interview Analytics",
  description: "Phòng điều khiển dành cho HR",
};

interface HRRoomPageProps {
  params: Promise<{
    roomCode: string;
  }>;
}

export default async function HRRoomPage({ params }: HRRoomPageProps) {
  const { roomCode } = await params;
  return <HRRoom roomCode={roomCode} />;
}
