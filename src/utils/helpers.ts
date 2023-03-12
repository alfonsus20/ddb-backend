import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import axios from 'axios';
import { encode } from 'blurhash';
import sharp from 'sharp';
import HttpException from '../exceptions/HttpException';
import { ResponseCodes } from './enums';

export const encodeImageToBlurhash = async (
  imageURL: string,
): Promise<string> => {
  const response = await axios.get(imageURL, {
    responseType: 'arraybuffer',
  });

  const bufferData = Buffer.from(response.data);

  return new Promise((resolve, reject) => {
    sharp(bufferData)
      .raw()
      .ensureAlpha()
      .resize(32, 32, { fit: 'cover' })
      // eslint-disable-next-line consistent-return
      .toBuffer((err, buffer, { width, height }) => {
        if (err) return reject(err);
        resolve(encode(new Uint8ClampedArray(buffer), width, height, 4, 4));
      });
  });
};

export const errorHandler = (err : unknown) : unknown | PrismaClientKnownRequestError => {
  if (err instanceof PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2025':
        return new HttpException(400, ResponseCodes.NOT_FOUND);
      case 'P2002':
        return new HttpException(404, ResponseCodes.DUPLICATE_DATA);
      default:
        return new HttpException(500, ResponseCodes.SERVER_ERROR);
    }
  }
  return err;
};
