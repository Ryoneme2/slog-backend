

import moment from 'moment';
import * as P from '@prisma/client';
import dotenv from 'dotenv';
import storageClient from '@config/connectStorage';
import { v4 } from 'uuid';

import { hashString, decodePassword } from '@util/DecryptEncryptString';
import uploadToBucket from '@helper/uploadToBucket';
import randAvatar from '@util/randomAvatar';

dotenv.config();

const prisma = new P.PrismaClient();

// type getOneReturnType = {
//   countDiary: number
//   fname: string;
//   lname: string;
//   username: string;
//   email: string;
//   password: string;
//   avatar: string;
//   bio: string;
//   dateTime: Date;
//   post: P.Posts[];
//   like: P.LikeBy[];
//   comment: P.Comments[];
//   diary: P.Diaries[];
//   followedBy: P.Follows[];
//   following: P.Follows[];
//   _count: P.Prisma.UsersCountOutputType;
// }

const _addUser = async (data: {
  firstName: string,
  lastName: string,
  email: string,
  username: string,
  password: string,
}) => {
  try {
    const randString = v4();

    const [hashedPassword, png] = await Promise.all([
      hashString(data.password),
      randAvatar(randString),
    ]);

    console.log({ hashedPassword, png });

    if (!hashedPassword || !png) return {
      isOk: false,
      msg: 'hash password error'
    }

    const { error, path } = await uploadToBucket(randString, 'avatar', png)

    if (error) return {
      isOk: false,
      data: {},
      msg: 'Something wrong when try to upload image to bucket',
    };

    const user = await prisma.users.create({
      data: {
        fname: data.firstName,
        lname: data.lastName,
        email: data.email,
        avatar: path,
        username: data.username,
        password: hashedPassword.hash,
      },
    });
    return {
      isOk: true,
      data: { ...user, password: '******' },
      msg: 'create success',
    };
  } catch (e) {
    console.log(e);
    if (e instanceof P.Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (e.code === 'P2002') {
        return {
          isOk: false,
          data: {},
          msg: `username is already taken`,
        };
      }
      return {
        isOk: false,
        data: {},
        msg: 'Internal Server Error register service',
      };
    }

    return {
      isOk: false,
      data: {},
      msg: 'Internal Server Error register service',
    };
  } finally {
    prisma.$disconnect()
  }
}

const _getOne = async (username: string, isSelectAll?: boolean) => {
  try {

    // isSelectAll = isSelectAll === undefined ? true : false

    const select = {
      fname: true,
      lname: true,
      username: true,
      email: true,
      password: true,
      avatar: true,
      bio: true,
      dateTime: true,
      post: true,
      diary: true,
      followedBy: true,
      following: true,
      _count: true,
    }

    // const selectWithoutPost = {
    //   fname: true,
    //   lname: true,
    //   username: true,
    //   email: true,
    //   password: true,
    //   avatar: true,
    //   bio: true,
    //   dateTime: true,
    //   diary: true,
    //   followedBy: true,
    //   following: true,
    //   _count: true,
    // }

    // const realSelect = isSelectAll ? select : selectWithoutPost

    const [userData] = await prisma.$transaction([
      prisma.users.findUnique({
        where: {
          username
        },
        select,
      }),
    ]);

    if (userData === null) return {
      isOk: true,
      data: null,
      msg: 'no error but user not found'
    };

    return {
      isOk: true,
      data: { ...userData },
      msg: ''
    };
  } catch (e) {
    console.error(e);

    return {
      isOk: false,
      data: null,
      msg: 'Internal error',
    };
  } finally {
    prisma.$disconnect();
  }
}

export {
  _addUser,
  _getOne
}
