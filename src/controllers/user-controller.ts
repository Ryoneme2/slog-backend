import { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config()

import { httpStats } from '@config/http';

const newUser = async (req: Request, res: Response) => {
  res.status(httpStats.ok).json('mama')
}

export {
  newUser
}
