import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const PORT: number = process.env.PORT ? Number(process.env.PORT) : 3000;

const GET_PHOTO_PROFILE_BASE_URL: string = process.env.GET_PHOTO_PROFILE_BASE_URL ? process.env.GET_PHOTO_PROFILE_BASE_URL : 'https://siakadu.unila.ac.id/uploads/fotomhs/thumb/';

const POSSIBLE_PROFILE_PHOTO_FILE_EXT_SUFFIXS: string[] = process.env.POSSIBLE_PROFILE_PHOTO_FILE_EXT_SUFFIXS ? process.env.POSSIBLE_PROFILE_PHOTO_FILE_EXT_SUFFIXS.split(',') : ['jpg'];

const STUDENT_PHOTO_FOLDER_NAME = '/student_photo/';

const STUDENT_PHOTO_BASE_STORAGE_PATH = path.normalize(path.join(__dirname, '../../', STUDENT_PHOTO_FOLDER_NAME));

const CRAWLING_REPORT_BASE_STORAGE = '/crawling_reports/';

export {
  PORT,
  GET_PHOTO_PROFILE_BASE_URL,
  POSSIBLE_PROFILE_PHOTO_FILE_EXT_SUFFIXS,
  STUDENT_PHOTO_BASE_STORAGE_PATH,
  STUDENT_PHOTO_FOLDER_NAME,
  CRAWLING_REPORT_BASE_STORAGE
}
