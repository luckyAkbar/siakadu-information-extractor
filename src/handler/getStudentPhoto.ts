import { Request, Response } from 'express';
import CustomError from '../class/Error/CustomError';
import Student from '../class/Student';

const getStudentPhoto = async (req: Request, res: Response): Promise<void> => {
  const { NPM } = req.params;

  try {
    console.log(1)
    const student = new Student(NPM);
    console.log(2)
    const isFileExists = await student.isFileExists();
    console.log(3)

    if (isFileExists) {
      console.log(4)
      student.sendFile(res);
      console.log(5)

      return;
    }
    console.log(6)
    await student.fetchProfilePicture();
    console.log(7)
    student.sendFile(res);
    console.log(8)
  } catch (e: unknown) {
    if (e instanceof CustomError) {
      console.log(e)
      res.status(e.status).json({ message: e.message });

      return;
    }

    res.sendStatus(500);
  }
};

export default getStudentPhoto;
