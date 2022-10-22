

import moment from 'moment';
import { PrismaClient, Prisma } from '@prisma/client';
import dotenv from 'dotenv';
import storageClient from '@config/connectStorage';
import { v4 } from 'uuid';

import { hashString, decodePassword } from '@util/DecryptEncryptString';
import randAvatar from '@util/randomAvatar';

dotenv.config();

const prisma = new PrismaClient();

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
    const bucketName = 'dii-project-bucket'
    const storageUrl =
      `https://oijsgpmyxcrqexaewofb.supabase.co/storage/v1/object/public/${bucketName}/`;

    const x = await storageClient
      .from(bucketName)
      .upload(`avatar/${randString}.png`, png, {
        cacheControl: '3600',
        upsert: false,
      });

    if (x.error) throw new Error(`${x.error.name} : ${x.error.message}`);

    const imageUrl = `${storageUrl}${x.data.path}`;

    await prisma.users.create({
      data: {
        fname: data.firstName,
        lname: data.lastName,
        email: data.email,
        avatar: imageUrl,
        username: data.username,
        password: hashedPassword.hash,
      },
    });
    return {
      isOk: true,
      msg: 'create success',
    };
  } catch (e) {
    console.log(e);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
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

const _getOne = async (username: string, select = {}) => {
  try {
    const config: Prisma.UsersFindUniqueArgs = {
      where: {
        username,
      },
    };

    if (Object.keys(select).length !== 0) config.select = select

    const [userData, countDiary] = await prisma.$transaction([
      prisma.users.findUnique(config),
      prisma.diaries.count({
        where: {
          assignTo: username,
        },
      }),
    ]);

    return {
      isOk: true,
      data: { ...userData, countDiary },
      msg: userData == null ? 'no error but user not found' : '',
    };
  } catch (e) {
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
