import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated ';
import { postComment } from '../controller/comment';

const router = express.Router();

router.route('/').post(isAuthenticated, postComment);

export default router