import { simpleValidate } from './../utils/validateValue';
import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { ZodError } from 'zod'
dotenv.config()

import { httpStats } from '@config/http';

const getOne = async (req: Request, res: Response) => {
  try {

    const { username, password } = req.body
    const [usernameZod, passwordZod] = [simpleValidate.string(username, 'username'), simpleValidate.string(password, 'password')]



    res.sendStatus(httpStats.notImplemented)

  } catch (e) {
    console.error(e);
    if (e instanceof ZodError) {
      return res.status(httpStats.badRequest).send({
        msg: e.issues
      })
    }
    res.sendStatus(httpStats.internalServerError)
  }
}

export {
  getOne
}
