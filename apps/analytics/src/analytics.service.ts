import { prisma } from '@/prisma';
import { Request, Response } from 'express';

export async function getUserStatistics(req: Request, res: Response) {
  const userId = req.session.passport?.user?.user_id;

  const statistics = await prisma.statistics.findMany({
    where: {
      user_id: userId,
    },
  });

  res.status(200).json(statistics);
}
