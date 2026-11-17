import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { GalleryGrid } from "@/components/gallery/gallery-grid";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Campus, facilities, classrooms, laboratories and student activity photographs at KM100 Skills and Training Center, Inc.",
};

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        title="Gallery"
        description="Campus, facilities, classrooms, laboratories and activities."
      />
      <Section>
        <GalleryGrid />
      </Section>
    </>
  );
}
