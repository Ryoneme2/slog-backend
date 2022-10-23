import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import { ZodError } from 'zod'
dotenv.config()

import { httpStatus } from '@config/http';
import { _getOne } from '@service/user-service';
import formatData from '@util/formatDateFromNow';

const getOne = async (req: Request, res: Response) => {
  console.log(req.params);
  const { userId } = req.params;
  try {
    const user = await _getOne(userId, true);

    console.log(user);


    if (!user.isOk) return res.status(httpStatus.badRequest).send(user);
    if (!user.data)
      return res.status(httpStatus.ok).send({
        isOk: true,
        data: null,
        msg: 'success on content',
      });

    const format = {
      name: `${user.data.fname} ${user.data.lname}`,
      username: user.data.username,
      profileUrl: user.data.avatar,
      bio: user.data.bio,
      postCount: user.data._count.post,
      diaryCount: user.data._count.diary,
      email: user.data.email,
      post: user.data.post
        .map((p) => {
          const formatDataC = formatData(p.dateTime);
          return {
            id: p.id,
            content: p.postContent,
            imageUrl: p.imageUrl,
            dateTime: formatDataC,
          };
        })
        .reverse(),
    };

    res.status(httpStatus.ok).send({
      isOk: true,
      data: format,
      msg: 'success',
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

export {
  getOne
}
