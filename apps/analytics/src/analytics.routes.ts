import { Router } from 'express';
import { getUserAnalytics, recordWebsiteVisit } from './analytics.service';
import { isAuthenticated, validateRequest } from '@/shared';
import { RecordWebsiteVisitBodySchema } from '@/data-access-analytics';

const router = Router();

router.use(isAuthenticated);

router.get('/', async (req, res) => {
  const userId = req.session.passport.user.user_id;
  const statistics = await getUserAnalytics(userId);

  res.status(200).json(statistics);
});

router.post(
  '/record-visit',
  validateRequest({ body: RecordWebsiteVisitBodySchema }),
  async (req, res) => {
    const userId = req.session.passport.user.user_id;
    const recordedVisit = await recordWebsiteVisit(userId, req.body);

    res.status(200).json(recordedVisit);
  }
);

export default router;
