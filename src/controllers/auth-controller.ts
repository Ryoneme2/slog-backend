import { simpleValidate } from '@util/validateValue';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import { ZodError } from 'zod'
import jwt from 'jsonwebtoken'
dotenv.config()

import { httpStatus } from '@config/http';
import { _addUser, _getOne } from '@service/user-service';
import { decodePassword } from '@util/DecryptEncryptString';


const login = async (req: Request, res: Response) => {
  try {

    const { username, password } = req.body
    const [usernameZod, passwordZod] = [simpleValidate.string(username, 'username') as string, simpleValidate.string(password, 'password') as string]

    const { data, isOk } = await _getOne(usernameZod)

    console.log(data);

    if (!isOk) return res.status(httpStatus.internalServerError).send({
      msg: 'Something went wrong with getOne user service'
    })
    if (!data) return res.status(httpStatus.forbidden).send({
      isOk: false,
      msg: 'user not found',
    });
    if (data?.password === undefined) return res.status(httpStatus.internalServerError).send({
      msg: 'Something went wrong with getOne user service2'
    })

    const isPasswordMatch = await decodePassword(passwordZod, data.password);

    if (data.username !== username || !isPasswordMatch)
      return res.status(httpStatus.forbidden).send({
        isOk: false,
        msg: 'username or password not match',
      });

    const secret = process.env.JWT_SECRET;

    if (!secret)
      return res.send({
        status: httpStatus.internalServerError,
        data: null,
        message: 'the key is not found',
      });

    const token = jwt.sign(
      {
        username: data.username,
        email: data.email,
      },
      secret
    );

    return res.status(httpStatus.ok).send({
      isOk: true,
      data: {
        token,
        username: data.username,
        firstName: data.fname,
        lastName: data.lname,
        imageUrl: data.avatar,
        email: data.email,
      },
      msg: 'ok',
    });


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
