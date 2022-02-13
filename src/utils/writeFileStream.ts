import path from 'path';
import fs from 'fs';

/**
 * @params {string} filename
 * @params {string} flags default 'a+'
 * @returns{fs.WriteStream} writeStream
 * 
 * will create a write stream. Returned value can be use to write file 
 */

const createWriteStream = (filename: string, flags: string = 'a+'): fs.WriteStream => {
  const filePath = path.resolve(path.normalize(__dirname + '../../../' + filename));
  const writeStream = fs.createWriteStream(filePath, {
    flags,
  });

  return writeStream;
};

export default createWriteStream;
