import { redirect } from "next/navigation";

interface RoomDetailsRedirectPageProps {
  params: Promise<{ id: string }>;
}

export default async function RoomDetailsRedirectPage({
  params,
}: RoomDetailsRedirectPageProps) {
  const { id } = await params;
  redirect(`/hotel/${id}`);
}
