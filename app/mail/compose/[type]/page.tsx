import type { Metadata } from "next";
import { buildMailComposeMetadata } from "@/lib/communitySeo";
import MailComposeClient from "@/components/MailComposeClient";

type PageProps = {
  params: Promise<{ type: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { type } = await params;
  return buildMailComposeMetadata(type);
}

export default async function MailComposePage({ params }: PageProps) {
  await params;
  return <MailComposeClient />;
}
