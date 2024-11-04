import { prisma, Statistics } from '@/prisma';
import { RecordWebsiteVisitBody } from '@/data-access-analytics';
import { getBaseUrl } from './utils';
import RabbitMQClient from './libs/rabbitmq/client';

export async function getUserAnalytics(userId: number): Promise<Statistics[]> {
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
  const baseUrl = getBaseUrl(data.url);

  let website = await prisma.website.findUnique({
    where: {
      domain: baseUrl,
    },
  });

  if (!website) {
    const response = await RabbitMQClient.produce({ url: data.url });
    if (!Array.isArray(response)) throw new Error('Classification failed');
    const [categoryName] = response;

    const category = await prisma.websiteCategory.findFirst({
      where: {
        category_name: categoryName,
      },
    });

    website = await prisma.website.create({
      data: {
        domain: baseUrl,
        category_id: category.category_id,
      },
    });
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
