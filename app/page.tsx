import { Hero } from "@/components/homepage/hero";
import { AboutPreview } from "@/components/homepage/about-preview";
import { ProgramsPreview } from "@/components/homepage/programs-preview";
import { CtaBand } from "@/components/homepage/cta-band";

// Remaining homepage sections from the plan (institutional highlights, why
// KM100, scholarship, facilities, gallery) go here.
export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutPreview />
      <ProgramsPreview />
      <CtaBand />
    </>
  );
}
