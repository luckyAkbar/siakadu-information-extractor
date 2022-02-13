import createWriteStream from '../../utils/writeFileStream';

export default class CustomError extends Error {
  status: number;

  constructor(message: string, status: number = 400) {
    super(message);

    this.status = status;
  }

  static logError(...messages: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const writeStream = createWriteStream('error.log');
        const now = new Date();

        writeStream.write(now.toString());
        writeStream.write('\n');
        writeStream.write(messages.join(' '));
        writeStream.write('\n\n');

        resolve();
      } catch (e: unknown) {
        reject(`Failed to write error log to file ${(e as Error).message}`);
      }
    });
  }
}

CustomError.logError('aduh', 'kena', 'error', 'terus gaies');