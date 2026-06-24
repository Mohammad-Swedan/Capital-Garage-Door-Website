import type { Article } from "@/types/article";
import { howOftenShouldYouServiceAGarageDoor } from "@/content/articles/how-often-should-you-service-a-garage-door";

/**
 * Registry of blog/guide articles (e.g. /blog/how-often-should-you-service-a-garage-door).
 * Add a new entry file + push it here to publish another article —
 * no routing or component changes required.
 */
export const articles: Article[] = [howOftenShouldYouServiceAGarageDoor];
