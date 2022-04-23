/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';

import { login } from './auth.controller';

const loginRouter = Router();

loginRouter.post('/', login);

export { loginRouter };
