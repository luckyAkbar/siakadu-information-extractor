import express from 'express';
import getStudentPhoto from '../handler/getStudentPhoto';

const router = express.Router();

router.route('/public/student/photo/:NPM')
  .get(getStudentPhoto);

export default router;
