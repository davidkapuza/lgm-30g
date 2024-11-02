import { z } from 'zod';

export const RecordWebsiteVisitBodySchema = z.object({
  url: z.string().url(),
  visitDuration: z.number(),
});
