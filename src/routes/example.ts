import cacheCheck from '@middleware/redis'
import express from 'express';

const router = express.Router();

router.get('/:ctx', cacheCheck, (req, res) => {
  console.log('cache miss')
  res.send('ยิ้ม')
})

export default router
