import * as crypto from 'crypto';

export const toHash = (buffer: crypto.BinaryLike) => {
  return crypto.createHash('sha256').update(buffer).digest('hex');
};
