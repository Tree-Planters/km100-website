import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { Placeholder } from "@/components/ui/placeholder";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact KM100 Skills and Training Center, Inc. — KM Building, Jamoral Ville, Purok 13, Barangay Cogon, Bogo City, Cebu 6010.",
};

const mapEmbedUrl = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL;

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contact Us"
        description="KM Building, Jamoral Ville, Purok 13, Barangay Cogon, Bogo City, Cebu 6010"
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4 text-sm text-km-charcoal/80">
            <p>
              <span className="font-semibold text-km-charcoal">Phone:</span>{" "}
              0967 093 5811
            </p>
            <p>
              <span className="font-semibold text-km-charcoal">Email:</span>{" "}
              km100skillsandtrainingcenter@gmail.com
            </p>
            <p>
              <span className="font-semibold text-km-charcoal">Facebook:</span>{" "}
              <a
                href="https://www.facebook.com/profile.php?id=100090317439588"
                className="text-km-orange hover:underline"
              >
                KM100 on Facebook
              </a>
            </p>
            <Placeholder label="Optional contact / inquiry form" />
          </div>
          <div>
            {mapEmbedUrl ? (
              <iframe
                src={mapEmbedUrl}
                title="KM100 campus location"
                className="h-80 w-full rounded-xl border border-km-charcoal/10"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <Placeholder label="Google Maps embed (set NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL)" />
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
