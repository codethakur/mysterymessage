import { z } from "zod";

export const signInSchema = z.object({
  identifier: z.string(),
  passoer: z.string(),
});
