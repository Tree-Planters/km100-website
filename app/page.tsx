import { Hero } from "@/components/homepage/hero";
import { ProgramsPreview } from "@/components/homepage/programs-preview";
import { CtaBand } from "@/components/homepage/cta-band";

// Remaining homepage sections from the plan (announcement bar, institutional
// highlights, about, why KM100, scholarship, facilities, gallery) go here.
export default function HomePage() {
  return (
    <>
      <Hero />
      <ProgramsPreview />
      <CtaBand />
    </>
  );
}
