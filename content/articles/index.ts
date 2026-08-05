import type { Article } from "@/types/article";
import { garageDoorSpringsGuide } from "@/content/articles/garage-door-springs-guide";
import { howOftenShouldYouServiceAGarageDoor } from "@/content/articles/how-often-should-you-service-a-garage-door";
import { howToProgramAGarageDoorRemote } from "@/content/articles/how-to-program-a-garage-door-remote";
import { howToResetAGarageDoorOpenerAndRemote } from "@/content/articles/how-to-reset-a-garage-door-opener-and-remote";
import { howToOpenAGarageDoorManually } from "@/content/articles/how-to-open-a-garage-door-manually";
import { howToFixGarageDoorSensor } from "@/content/articles/how-to-fix-garage-door-sensor";

/**
 * Registry of blog/guide articles (e.g. /blog/how-often-should-you-service-a-garage-door).
 * Add a new entry file + push it here to publish another article —
 * no routing or component changes required.
 */
export const articles: Article[] = [
  garageDoorSpringsGuide,
  howOftenShouldYouServiceAGarageDoor,
  howToProgramAGarageDoorRemote,
  howToResetAGarageDoorOpenerAndRemote,
  howToOpenAGarageDoorManually,
  howToFixGarageDoorSensor,
];
