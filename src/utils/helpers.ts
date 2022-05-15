import axios from "axios";
import { encode } from "blurhash";
import sharp from "sharp";

export const encodeImageToBlurhash = async (imageURL: string) => {
  const response = await axios.get(imageURL, {
    responseType: "arraybuffer",
  });

  const bufferData = Buffer.from(response.data);

  return new Promise((resolve, reject) => {
    sharp(bufferData)
      .raw()
      .ensureAlpha()
      .resize(32, 32, { fit: "inside" })
      .toBuffer((err, buffer, { width, height }) => {
        if (err) return reject(err);
        resolve(encode(new Uint8ClampedArray(buffer), width, height, 4, 4));
      });
  });
};
