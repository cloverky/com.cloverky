"use client";

import { HeroSection } from "@/components/hero-section";
import { TitanicCsvUploadSection } from "@/components/titanic-csv-upload-section";
import { FeaturesSection } from "@/components/features-section";
import { AgentsSection } from "@/components/agents-section";
import { ArchitectureSection } from "@/components/architecture-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <HeroSection />
      <TitanicCsvUploadSection />
      <FeaturesSection />
      <AgentsSection />
      <ArchitectureSection />
      <Footer />
    </main>
  );
}
