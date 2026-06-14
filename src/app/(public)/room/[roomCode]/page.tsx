import CandidateRoom from "@/components/features/interviews/CandidateRoom";

export const metadata = {
  title: "Phòng Phỏng Vấn | Interview Analytics",
  description: "Tham gia phỏng vấn trực tuyến",
};

interface RoomPageProps {
  params: Promise<{
    roomCode: string;
  }>;
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { roomCode } = await params;
  return <CandidateRoom roomCode={roomCode} />;
}
