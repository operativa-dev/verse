import { db } from "./model.js";
import { Verse } from "@operativa/verse";

export default {
  verse: db,
} as { verse: Verse };
