import express from 'express';
import * as userController from '@controller/user-controller';
import auth from '@middleware/auth';

const router = express.Router();

router.get('/:userId', auth, userController.getOne)

export default router
