import { type App } from "@repo/api";
import { edenTreaty } from "@elysiajs/eden";

export const client = edenTreaty<App>("http://localhost:8080");
