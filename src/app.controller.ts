import {
  Controller,
  Request,
  Post,
  UseGuards,
  Res,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
} from '@nestjs/common';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { Public } from './utils/decorators/isPublic.decorator';
import { RegisterUserDTO, UsersLoginDTO } from './users/dto/Users.dto';
import { UsersService } from './users/users.service';
import { User } from './db/models/User.entity';
import 'dotenv/config';
import { ChestsService } from './chests/chests.service';

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly chestService: ChestsService,
  ) {}

  private async signIn(user: User, res) {
    const access_token = await this.authService.login(user);

    const cookiesOpts = {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 3,
    };

    res.cookie('jwt', access_token, cookiesOpts);

    return {
      response: {
        user: user,
        expire: new Date().setDate(new Date().getDate() + 3),
      },
    };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(
    @Body() _: UsersLoginDTO,
    @Request() req,
    @Res({ passthrough: true }) res,
  ) {
    return await this.signIn(req.user, res);
  }

  @Public()
  @Post('auth/register')
  async register(
    @Body() body: RegisterUserDTO,
    @Res({ passthrough: true }) res,
  ) {
    const user = await this.usersService.register(body);

    return await this.signIn(user, res);
  }

  @Post('auth/jwt')
  async verifyJwt(
    @Request() req,
    @Res({ passthrough: true }) res,
  ): Promise<{ expired: boolean }> {
    const { jwt } = req.cookies;

    if (jwt) {
      const expired = await this.authService.verifyJwt(jwt);

      if (expired) {
        res.cookie('jwt', '', {
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
          sameSite: 'strict',
          path: '/',
          maxAge: 0,
        });

        return {
          expired: true,
        };
      }

      return {
        expired: false,
      };
    }

    return {
      expired: true,
    };
  }

  @Get('auth/logout')
  async logout(
    @Request() req,
    @Res({ passthrough: true }) res,
  ): Promise<{ logout: boolean }> {
    await this.chestService.deleteAll();

    res.cookie('jwt', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      path: '/',
      maxAge: 0,
    });

    return {
      logout: true,
    };
  }
}
