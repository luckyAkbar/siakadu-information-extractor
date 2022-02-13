import https from 'https';
import axios from 'axios';
import CustomError from './Error/CustomError';
import createWriteStream from '../utils/writeFileStream';
import {
  STUDENT_PHOTO_FOLDER_NAME as studentPhotoFolderName,
  CRAWLING_REPORT_BASE_STORAGE as crawlingReportBaseStorage,
  GET_PHOTO_PROFILE_BASE_URL as baseURL,
  POSSIBLE_PROFILE_PHOTO_FILE_EXT_SUFFIXS as possibleImageSuffix,
} from '../config/config';

export default class ProfilePhotoCrawler {
  maxCrawlingAttempt: number | undefined;
  crawlingReportID: string;
  currentNPM: number;
  NPMStartingPoint: number;

  constructor(NPMStartingPoint: number = 0, maxCrawlingAttempt: number | undefined = undefined) {
    this.maxCrawlingAttempt = maxCrawlingAttempt;
    this.crawlingReportID = Date();
    this.NPMStartingPoint = NPMStartingPoint;
    this.currentNPM = this.NPMStartingPoint;
  }

  async startCrawling() {
    try {
      while(true) {
        const NPM = this.currentNPMAsString;

        console.log('crawling for ', NPM);

        await this.performPhotoCrawling(NPM);

        this.incrementNPM();
        this.decrementCrawlingAttempt();

        if (NPM.startsWith(this.getMaxNPMYearPrefix())) return;
        if (this.maxCrawlingAttempt === 0) return;
      }

    } catch (e: unknown) {
      console.log(e);
    }
  }
  
  async performPhotoCrawling(NPM: string) {
    for (let i = 0; i < possibleImageSuffix.length; i++) {
      try {
        const url = this.generatePhotoURL(NPM, possibleImageSuffix[i]);
        const image = await this.crawlProfilePhoto(url);

        await this.saveImage(image, NPM, possibleImageSuffix[i]);
        await this.crawlingResultReporter(NPM, 'OK');

        return;
      } catch (e: unknown) {
        console.log(e);
        continue;
      }
    }

    throw new Error();
  }

  async crawlProfilePhoto(url: string) {
    try {
      const result = await axios.get(url, {
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
        responseEncoding: 'base64',
      });

      if (result.status === 200) return result.data;
      
      throw new Error('Siakadu server returning response status indicating crawling failed.');
    } catch (e: unknown) {
      throw e;
    }
  }

  async crawlingResultReporter(NPM: string, status: string) {
    const reportName = crawlingReportBaseStorage + 'Crawling Report -' + this.crawlingReportID + '.log';

    try {
      console.log(reportName);
      const writeStream = createWriteStream(reportName);
      writeStream.write(`${NPM} - ${status}`);
      writeStream.write('\n');

      console.log('selesai rpor')
    } catch (e: unknown) {
      await CustomError.logError(`Failed to write crawling report status for: ${NPM}. status: ${status}`);
    }
  }

  saveImage(data: string, NPM: string, imageExt: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const filename = NPM + imageExt;
      const fullname = studentPhotoFolderName + NPM + imageExt;
      
      const writeStream = createWriteStream(fullname);
      writeStream.write(data, 'base64');
      
      resolve(filename);
    });
  }

  incrementNPM() {
    this.currentNPM += 1;
  }

  decrementCrawlingAttempt() {
    if (this.maxCrawlingAttempt === undefined) return;

    this.maxCrawlingAttempt -= 1;
  }

  get currentNPMAsString(): string {
    return String(this.currentNPM);
  }

  getMaxNPMYearPrefix(): string {
    const now = new Date();
    const lastDigitYear = (now.getFullYear() + 1).toString().slice(2);

    return lastDigitYear;
  }

  generatePhotoURL(NPM: string, ext: string): string {
    const url = baseURL + NPM + ext;

    return url;
  }
}