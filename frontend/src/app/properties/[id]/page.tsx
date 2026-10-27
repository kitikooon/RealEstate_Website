import { notFound } from "next/navigation";
import PropertyDetailClient from "@/components/PropertyDetailClient";

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const n = Number(id);
  if (!Number.isInteger(n) || n <= 0) notFound();
  return <PropertyDetailClient id={n} />;
}
