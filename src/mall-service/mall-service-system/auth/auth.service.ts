import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/sys-user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import Result from '../../../common/utils/Result';
import { UsersRoleService } from '../users-role/users-role.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private usersRoleService: UsersRoleService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    loginName: string,
    pass: string,
  ): Promise<Result<{ access_token: string }>> {
    const result = await this.usersService.findByLoginName(loginName);
    const user = result.data;

    const isMatch = await bcrypt.compare(pass, user?.password);

    if (!isMatch) {
      throw new UnauthorizedException();
    }
    // 获取用户角色
    const { data: userRoles } = await this.usersRoleService.findRolesIdByUserId(
      user.id,
    );
    const payload = { user_id: user.id, loginName: user.loginName };
    const data = {
      access_token: await this.jwtService.signAsync(payload),
      userInfo: {
        id: user.id,
        loginName: user.loginName,
        roles: userRoles,
        // 还差一个用户角色
        // name: user.name,
        // avatar: user.avatar
      },
    };
    return new Result(data, '登录成功');
  }

  async getProfile(req: any) {
    const token = req.headers.authorization?.split(' ')[1]; // 从请求头中获取 token
    const decoded = this.jwtService.verify(token); // 验证并解码 token
    const userId = decoded.user_id; // 从解码后的 token 中获取用户 ID
    const { data: user } = await this.usersService.findById(userId);
    // 获取用户角色
    const { data: userRoles } =
      await this.usersRoleService.findRolesIdByUserId(userId);

    const data = {
      id: user.id,
      loginName: user.loginName,
      roles: userRoles,
    };

    return new Result(data, '登录成功');
  }
}
