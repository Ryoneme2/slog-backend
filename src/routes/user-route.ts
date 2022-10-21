import express from 'express';
import * as USER_CONTROLLER from '@controller/user-controller';

const router = express.Router();

router.get('/', USER_CONTROLLER.newUser)

export default router
