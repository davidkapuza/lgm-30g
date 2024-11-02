import { prisma, Statistics } from '@/prisma';
import { RecordWebsiteVisitBody } from '@/data-access-analytics';
import { getBaseUrl } from './utils';

export async function getUserStatistics(userId: number): Promise<Statistics[]> {
  const statistics = await prisma.statistics.findMany({
    where: {
      user_id: userId,
    },
  });

  return statistics;
}

export async function recordWebsiteVisit(
  userId: number,
  data: RecordWebsiteVisitBody
): Promise<Statistics> {
  const website = await prisma.website.findUnique({
    where: {
      domain: getBaseUrl(data.url),
    },
  });

  if (!website) {
    // TODO request to classifier service and store new website with category in db
  }

  const statistics = await prisma.statistics.upsert({
    where: {
      user_id_website_id: {
        user_id: userId,
        website_id: website.website_id,
      },
    },
    update: {
      visit_count: { increment: 1 },
      last_visit_time: new Date(),
      total_time_spent: { increment: data.visitDuration },
      updated_at: new Date(),
    },
    create: {
      user_id: userId,
      website_id: website.website_id,
      visit_count: 1,
      last_visit_time: new Date(),
      total_time_spent: data.visitDuration,
    },
  });
  return statistics;
}
