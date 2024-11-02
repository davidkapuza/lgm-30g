import { z } from 'zod';
import { RecordWebsiteVisitBodySchema } from './contracts';

export type RecordWebsiteVisitBody = z.infer<
  typeof RecordWebsiteVisitBodySchema
>;
