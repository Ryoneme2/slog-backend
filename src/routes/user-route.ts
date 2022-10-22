import express from 'express';
import * as userController from '@controller/user-controller';

const router = express.Router();

router.post('/', userController.getOne)

export default router
