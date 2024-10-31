import { Router } from 'express';
import { getUserStatistics } from './analytics.service';
import { isAuthenticated } from '@/shared';

const router = Router();

router.get('/', isAuthenticated, getUserStatistics);

export default router;
