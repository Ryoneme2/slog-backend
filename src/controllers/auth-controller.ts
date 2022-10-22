import { simpleValidate } from '../utils/validateValue';
import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { ZodError } from 'zod'
dotenv.config()

import { httpStatus } from '@config/http';
import { _addUser, _getOne } from '@service/user-service';

const login = async (req: Request, res: Response) => {
  try {

    const { username, password } = req.body
    const [usernameZod, passwordZod] = [simpleValidate.string(username, 'username') as string, simpleValidate.string(password, 'password') as string]

    const { data, isOk } = await _getOne(usernameZod)

    if (!isOk) return res.status(httpStatus.internalServerError).send({
      msg: 'Something went wrong with getOne user service'
    })
    if (!data)
      return res.status(httpStatus.forbidden).send({
        isOk: false,
        msg: 'user not found',
      });




    res.sendStatus(httpStatus.notImplemented)

  } catch (e) {
    console.error(e);
    if (e instanceof ZodError) {
      return res.status(httpStatus.badRequest).send({
        msg: e.issues
      })
    }
    res.sendStatus(httpStatus.internalServerError)
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

    if (!result.isOk || typeof result.data === 'undefined') return res.status(httpStatus.internalServerError).send(result)

    return res.status(httpStatus.created).send(result);

  } catch (e) {
    console.error(e);
    if (e instanceof ZodError) {
      return res.status(httpStatus.badRequest).send({
        msg: e.issues
      })
    }
    res.sendStatus(httpStatus.internalServerError)
  }
}

export {
  login,
  register
}
