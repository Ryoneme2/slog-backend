import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/avatars-avataaars-sprites';
import sharp from 'sharp';
import { v4 } from 'uuid';

const randAvatar = async (name: number | string) => {
  try {
    const svg = createAvatar(style, {
      seed: `${name}${Math.random().toFixed(2)}`,
    });

    const svgBuffer = Buffer.from(svg);

    return await sharp(svgBuffer).resize(600, 600).png().toBuffer()
  } catch (e) {
    console.error(e);
    return
  }
};

export default randAvatar;