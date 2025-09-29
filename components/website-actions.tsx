"use client";

import { useActionState } from "react";
import { fetchWebsiteActions, type WebsiteActionsState } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LinkIcon, Loader2Icon } from "lucide-react";
import { ActionItem } from "./action-item";
import { Input } from "@/components/ui/input";

const SkeletonActions = () => {
  return Array.from({ length: 6 }).map((_, i) => (
    <div key={`skeleton-${i}`} className="rounded-md border p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  ));
};

const initialState: WebsiteActionsState = {
  url: "",
  data: null,
};

export function WebsiteActions() {
  const [state, formAction, pending] = useActionState(
    fetchWebsiteActions,
    initialState
  );

  const items = state.data?.interactive_elements ?? [];

  return (
    <div className="space-y-6">
      <form action={formAction} className="flex items-end gap-2">
        <div className="flex-1">
          <label htmlFor="url" className="block text-sm font-medium mb-2">
            URL
          </label>
          <Input
            id="url"
            name="url"
            type="url"
            defaultValue={state.url}
            placeholder="https://example.com/page"
            disabled={pending}
            autoFocus
            required
            className="w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <Button type="submit" disabled={pending}>
          {pending ? (
            <Loader2Icon className="h-4 w-4 animate-spin" />
          ) : (
            "Analyze"
          )}
        </Button>
      </form>

      {state.error ? (
        <div className="text-sm text-destructive">{state.error}</div>
      ) : null}
      {!pending && !items.length ? (
        <div className="text-sm text-muted-foreground bg-muted p-2 rounded-md flex items-center gap-2">
          <LinkIcon className="h-4 w-4" /> Enter a URL and click Analyze
        </div>
      ) : (
        <div className="space-y-3 grid grid-cols-1 sm:grid-cols-2 gap-3 min-h-40">
          {pending ? (
            <SkeletonActions />
          ) : items.length ? (
            items.map((item, index) => (
              <ActionItem
                key={`${item.element_aria_label}-${index}`}
                item={item}
              />
            ))
          ) : null}
        </div>
      )}
    </div>
  );
}
