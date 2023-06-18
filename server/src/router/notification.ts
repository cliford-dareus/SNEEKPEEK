import express from 'express'
import isAuthenticated from '../middleware/isAuthenticated ';
import { getNotification } from '../controller/notification';

const router = express.Router();

router.route('/').get(isAuthenticated, getNotification);

export default router;