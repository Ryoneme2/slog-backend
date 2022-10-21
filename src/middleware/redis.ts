import { client, connectClient, quitClient } from '../configs/redisConnection'
import { Request, Response, NextFunction } from 'express'
import { httpStats } from '../configs/http'

const cacheCheck = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectClient()
    const params = Object.values(req.params)
    console.log(Object.values(req.params))
    if (!params) return next()
    const eachGet = params.map(v => client.get(v))
    const value = await Promise.all(eachGet)
    if (value.every(v => v === null)) {
      next()
      return
    }
    console.log('cache hit')

    res.status(200).send({
      cached: true,
      data: value,
      msg: 'success get data'
    })
  } catch (e) {
    console.error(e);

  } finally {
    await quitClient()
  }
}

export default cacheCheck