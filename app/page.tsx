import { WebsiteActions } from "@/components/website-actions";

export default function Home() {
  return (
    <div className="font-sans min-h-screen p-8 sm:p-20">
      <div className="mx-auto w-full max-w-4xl">
        <h1 className="text-2xl font-semibold mb-6">Website Actions</h1>
        <WebsiteActions />
      </div>
    </div>
  );
}
