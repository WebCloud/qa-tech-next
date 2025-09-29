import { z } from "zod";

export const outputSchema = z.object({
  interactive_elements: z.array(
    z.object({
      website_section: z
        .string()
        .describe(
          "The section of the website where this element is located (e.g., Header, Sidebar, Main Content, Footer, Navigation, etc.)"
        ),
      website_section_selector: z
        .string()
        .describe(
          "A CSS selector that targets the section containing this element (e.g., 'nav.sidebar', 'header', 'main', '.footer')"
        ),
      state_before: z
        .string()
        .describe(
          "Description of the current state before interacting with this element"
        ),
      state_after: z
        .string()
        .describe(
          "Description of the expected state after interacting with this element"
        ),
      change_analysis: z
        .string()
        .describe(
          "Analysis of what changes occur when this element is interacted with"
        ),
      action_type: z
        .enum(["interaction", "navigation"])
        .describe(
          "The type of action that can be performed on this element (e.g., interaction, navigation)"
        ),
      element_aria_label: z
        .string()
        .describe(
          "The best possible text locator for this element (e.g., aria-label, innerText, label, alt text, etc.)"
        ),
    })
  ),
});
