import { simpleValidate } from '../utils/validateValue';
import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { ZodError } from 'zod'
dotenv.config()

import { httpStats } from '@config/http';
import { _addUser } from '@service/user-service';

const login = async (req: Request, res: Response) => {
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

const register = async (req: Request, res: Response) => {
  try {

    const { firstName, lastName, email, username, password } = req.body
    const [firstNameZod, lastNameZod, emailZod, usernameZod, passwordZod] = [
      simpleValidate.string(firstName, 'first name') as string,
      simpleValidate.string(lastName, 'last name') as string,
      simpleValidate.mail(email, 'email') as string,
      simpleValidate.string(username, 'username') as string,
      simpleValidate.string(password, 'password') as string,
    ]

    const result = await _addUser({ firstName: firstNameZod, lastName: lastNameZod, email: emailZod, username: usernameZod, password: passwordZod })

    if (!result.isOk || typeof result.data === 'undefined') return res.status(httpStats.internalServerError).send(result)

    return res.status(httpStats.created).send(result);

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
  login,
  register
}
