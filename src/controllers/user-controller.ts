import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { ZodError } from 'zod'
dotenv.config()

import { httpStats } from '@config/http';

const getOne = async (req: Request, res: Response) => {
  try {

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

// https://oijsgpmyxcrqexaewofb.supabase.co/storage/v1/object/public/dii-project-bucket/avatar/47d1e446-3bd5-46d0-b674-3376ece59a60.png
// https://oijsgpmyxcrqexaewofb.supabase.co/storage/v1/object/public/avatar/47d1e446-3bd5-46d0-b674-3376ece59a60.png
