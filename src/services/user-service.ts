

import moment from 'moment';
import { PrismaClient, Prisma } from '@prisma/client';
import dotenv from 'dotenv';
import storageClient from '@config/connectStorage';
import { v4 } from 'uuid';

import { hashString, decodePassword } from '@util/DecryptEncryptString';
import randAvatar from '@util/randomAvatar';

dotenv.config();

const prisma = new PrismaClient();

const _addUser = async (username: string) => {
  return
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
