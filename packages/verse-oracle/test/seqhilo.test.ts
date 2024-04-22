import { seqHiloTests } from "@operativa/verse/test/identity/seqhilo";
import { queryFixture } from "@operativa/verse/test/query/query";
import { describe } from "vitest";
import { testDb } from "./infra.js";

describe("shared", () => seqHiloTests(queryFixture(testDb("seqhilo")).config));
