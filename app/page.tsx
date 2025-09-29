import { outputSchema } from "@/lib/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ArrowRight, LinkIcon, Pointer } from "lucide-react";
import { PopoverArrow } from "@radix-ui/react-popover";
import { Badge } from "@/components/ui/badge";

const baseURL =
  process.env.VERCEL_PROJECT_PRODUCTION_URL || "http://localhost:3000";

type ActionType = "interaction" | "navigation";

function ActionIcon({
  type,
  className,
}: {
  type: ActionType;
  className?: string;
}) {
  const Icon = type === "interaction" ? Pointer : ArrowRight;
  return <Icon className={className} aria-hidden="true" />;
}

export default async function Home() {
  const response = await fetch(
    `${baseURL}/api/website-actions?url=${encodeURIComponent(
      "https://vaul.emilkowal.ski/getting-started"
    )}`
  );
  const { data } = await response.json();
  const parsedData = outputSchema.parse(data);

  const items = parsedData.interactive_elements;

  return (
    <div className="font-sans min-h-screen p-8 sm:p-20">
      <div className="mx-auto w-full max-w-4xl">
        <h1 className="text-2xl font-semibold mb-6">Website Actions</h1>
        <Badge variant="default" className="mb-6">
          <LinkIcon className="h-4 w-4" /> URL
        </Badge>
        <div className="space-y-3 grid grid-cols-2 gap-3">
          {items.map((item, index) => (
            <Popover key={`${item.element_aria_label}-${index}`}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="flex items-center justify-between rounded-md border bg-background px-4 py-3 text-left shadow-sm hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border bg-card text-card-foreground shrink-0">
                      <ActionIcon
                        type={item.action_type as ActionType}
                        className="h-4 w-4"
                      />
                    </span>
                    <div className="flex flex-col gap-2">
                      <span className="font-medium leading-none">
                        {item.element_aria_label || "Unnamed element"}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {item.website_section}
                      </span>
                    </div>
                  </div>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-96">
                <PopoverArrow />
                <div className="grid gap-4">
                  <div className="flex flex-col gap-2">
                    <h4 className="font-medium leading-none flex items-center justify-between gap-2">
                      {item.element_aria_label}
                      <Badge variant="secondary">{item.action_type}</Badge>
                    </h4>
                    <p className="text-sm text-muted-foreground bg-muted p-2 rounded-md">
                      {item.website_section} — selector:{" "}
                      <code className="text-xs">
                        {item.website_section_selector}
                      </code>
                    </p>
                  </div>
                  <div className="grid gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">State before</p>
                      <p className="whitespace-pre-wrap break-words">
                        {item.state_before}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">State after</p>
                      <p className="whitespace-pre-wrap break-words">
                        {item.state_after}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Change analysis</p>
                      <p className="whitespace-pre-wrap break-words">
                        {item.change_analysis}
                      </p>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          ))}
        </div>
      </div>
    </div>
  );
}
