import { Verse } from "@operativa/verse";
import { db } from "./src/data.ts";

export default {
  verse: db,
} as { verse: Verse };
