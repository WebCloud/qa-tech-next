import { outputSchema } from "@/lib/types";

const baseURL =
  process.env.VERCEL_PROJECT_PRODUCTION_URL || "http://localhost:3000";

export default async function Home() {
  const response = await fetch(
    `${baseURL}/api/website-actions?url=${encodeURIComponent(
      "https://vaul.emilkowal.ski/getting-started"
    )}`
  );
  const { data } = await response.json();
  const parsedData = outputSchema.parse(data);
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <pre>{JSON.stringify(parsedData, null, 2)}</pre>
    </div>
  );
}
