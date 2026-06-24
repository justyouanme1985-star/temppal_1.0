import { communityWriteMetadata } from "@/lib/communitySeo";
import CommunityWriteClient from "@/components/CommunityWriteClient";

export const metadata = communityWriteMetadata;

export default function CommunityWritePage() {
  return <CommunityWriteClient />;
}
