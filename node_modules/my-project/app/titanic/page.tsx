import { TitanicCsvUploadSection } from "@/components/titanic-csv-upload-section";

export default function TitanicPage() {
  return (
    <main className="flex min-h-screen flex-col bg-white pt-32 text-neutral-900">
      <div className="flex flex-1 flex-col items-center px-6 pb-24">
        <h1 className="mb-12 text-center text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl">
          타이타닉 홈
        </h1>
        <TitanicCsvUploadSection bypassLocalGuard splitDropAndButton />
      </div>
    </main>
  );
}
