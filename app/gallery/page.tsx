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
        <div className="border-t-2 border-km-orange pt-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-km-charcoal">
            The school, in pictures
          </p>
        </div>

        <div className="mt-10 lg:mt-12">
          <GalleryGrid />
        </div>
      </Section>
    </>
  );
}
