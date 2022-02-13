import dotenv from 'dotenv';
import server from './app/server';

dotenv.config();

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

server.listen(port, () => {
  process.stdout.write(`Server listening on PORT: ${port}`);
});
