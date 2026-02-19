import { TitleDetailClient } from "@/components/title-detail-client";
import type { MediaType } from "@/lib/types";

type Props = {
  params: {
    mediaType: string;
    id: string;
  };
};

export default function TitlePage({ params }: Props) {
  const mediaType: MediaType = params.mediaType === "tv" ? "tv" : "movie";
  return <TitleDetailClient id={params.id} mediaType={mediaType} />;
}

