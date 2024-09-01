import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Req,
  Res,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { Response, Request } from 'express';

import { UserService } from './user.service';

import * as jwt from 'jsonwebtoken';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  async getAllUsers(@Req() req: Request, @Res() res: Response) {}

  @Post('/auth')
  async getUser(@Req() req: Request, @Res() res: Response) {
    const userData = await this.userService.getUserData(req.body);

    if ('error' in userData) {
      return res.status(400).send(userData);
    }

    const token = jwt.sign(
      {
        login: userData.login,
        email: userData.email,
      },
      'secret123',
    );

    delete userData.password;

    const data = {
      ...userData,
      token,
    };

    return res.send({ status: 'ok', data });
  }

  @Post('/')
  async createUser(@Req() req: Request, @Res() res: Response) {
    await this.userService.createUser(req.body);
    console.log(req.body);
    return res.send({ status: 'ok' });
  }

  @Get('/auth/:token')
  async updateUser(
    @Req() req: Request,
    @Res() res: Response,
    @Param('token') token: string,
  ) {
    try {
      const user = await this.userService.checkAuthMe(token);
      console.log(user)
      return res.send({ status: 'ok', user });
    } catch (error) {
      return res.status(401).send({ error: error.message });
    }
  }

  @Patch('/:id')
  async updateUserField(@Req() req: Request, @Res() res: Response) {}

  @Delete('/:id')
  async deleteUser(@Req() req: Request, @Res() res: Response) {}
}
