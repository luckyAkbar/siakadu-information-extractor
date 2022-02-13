import https from 'https';
import { access } from 'fs/promises';
import { constants } from 'fs';
import { Response } from 'express';
import axios from 'axios';
import CustomError from "./Error/CustomError";
import {
  GET_PHOTO_PROFILE_BASE_URL as getPhotoBaseURL,
  POSSIBLE_PROFILE_PHOTO_FILE_EXT_SUFFIXS as fileSuffixs,
  STUDENT_PHOTO_FOLDER_NAME as studentPhotoFolderName,
  STUDENT_PHOTO_BASE_STORAGE_PATH as studentPhotoBaseStorage,
} from "../config/config";
import createWriteStream from '../utils/writeFileStream';

export default class Student {
  NPM: string;
  imageExt: string;
  filename: string | undefined;

  constructor(NPM: string) {
    this.NPM = NPM;
    this.imageExt = '.jpg';

    this.validate();
  }

  async tryGetProfilePicture(): Promise<string> {
    for (let i = 0; i < getPhotoBaseURL.length; i++) {
      const url = getPhotoBaseURL + this.NPM + fileSuffixs[i];
      this.imageExt = fileSuffixs[i];

      try {
        const result = await axios.get(url, {
          httpsAgent: new https.Agent({
            rejectUnauthorized: false,
          }),
          responseType: 'stream',
          responseEncoding: 'base64',
        });
        
        console.log(result)

        if (result.status === 200) return result.data;
      } catch (e: unknown) {
        throw new CustomError('Server failed to fetch request for photo profile from Siakadu Server.', 500);
      }
    }

    throw new CustomError(`Cannot find all possible photo profile for student with NPM: ${this.NPM}`, 404);
  }

  saveImage(data: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const filename = this.NPM + this.imageExt;
      const fullname = studentPhotoFolderName + this.NPM + this.imageExt;
      
      const writeStream = createWriteStream(fullname);
      writeStream.write(data, 'base64');
      
      resolve(filename);
    })
  }

  async isFileExists(): Promise<boolean> {
    for (let i = 0; i < fileSuffixs.length; i++) {
      try {
        const filepath = studentPhotoBaseStorage + this.NPM + fileSuffixs[i];
        const filename = this.NPM + fileSuffixs[i]
        await access(filepath, constants.R_OK);

        this.filename = filename;

        return true;
      } catch (e: unknown) {
        continue;
      }
    }
    
    return false;
  }

  async fetchProfilePicture() {
    try {
      console.log('a');
      const imageData = await this.tryGetProfilePicture();
      console.log('b')
      this.filename = await this.saveImage(imageData);
      console.log('c')
    } catch (e: unknown) {
      console.log(e)
      await CustomError.logError('Error while fetching profile picture', (e as Error).message);
      throw new CustomError('Failed to fetch student image profile', 500);
    }
  }

  sendFile(res: Response) {
    if (this.filename === undefined) {
      res.status(404).json({ message: 'File not found' });

      return;
    }

    console.log(this.filename)

    res.sendFile(this.filename, {
      root: studentPhotoBaseStorage,
    });
  }

  validate() {
    if (Number.isNaN(Number(this.NPM))) throw new CustomError('NPM field must be a number.', 400);
  }
}