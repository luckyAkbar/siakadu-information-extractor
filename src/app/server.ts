import express from 'express';
import helmet from 'helmet';
import routes from '../router/routes';

const server = express();

server.use(express.urlencoded({ extended: false }));
server.use(express.json());
server.use(helmet());
server.use(routes);

export default server;
