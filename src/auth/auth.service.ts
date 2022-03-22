import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../db/models/User.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (user && (await user.compareHash(pass))) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: User) {
    //Set infos in JTW here
    const payload = { email: user.email, id: user.id, roles: user.roles };
    return this.jwtService.sign(payload, { expiresIn: '3d' });
  }

  async verifyJwt(jwt): Promise<boolean> {
    try {
      const decoded = await this.jwtService.verify(jwt);
      const { exp, access_until } = decoded;

      if (access_until && access_until <= Date.now()) {
        return true;
      }

      if (exp > Date.now() / 1000) {
        return false;
      }

      return true;
    } catch (error) {
      return true;
    }
  }
}
