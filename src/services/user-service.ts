

import moment from 'moment';
import { PrismaClient, Prisma } from '@prisma/client';
import dotenv from 'dotenv';
import storageClient from '@config/connectStorage';
import { v4 } from 'uuid';

// import { hashString, decodePassword } from '../libs/DecryptEncryptString';
// import randAvatar from '../libs/randomAvatar';

dotenv.config();

const prisma = new PrismaClient();
