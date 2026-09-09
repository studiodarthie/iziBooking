import { getMediaLinks } from "./actions";
import MediaClient from "./MediaClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Médiathèque | iziBooking",
};

export default async function MediaPage() {
  const mediaLinks = await getMediaLinks();
  
  return (
    <MediaClient initialMedia={mediaLinks} />
  );
}
