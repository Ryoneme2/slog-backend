import { client } from '../configs/redisConnection'
import { Request, Response, NextFunction } from 'express'
import { httpStats } from '../configs/http'

const cacheCheck = async (req: Request, res: Response, next: NextFunction) => {
  const value = await client.get('name')
  if (!value) return next()
  console.log('cache hit')

  res.status(200).send({
    cached: true,
    data: value,
    msg: 'success get data'
  })
}

export default cacheCheck