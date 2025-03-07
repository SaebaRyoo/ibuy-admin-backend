import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/sys-user.service';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import * as bcrypt from 'bcrypt';
import Result from '../../../common/utils/Result';
import { UsersRoleService } from '../users-role/users-role.service';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersRoleService: UsersRoleService,
    private readonly jwtService: JwtService,
    @InjectRedis() private readonly redis: Redis,
    private configService: ConfigService,
  ) {}

  private async storeRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<void> {
    const key = `refresh_token:${userId}`;
    await this.redis.set(key, refreshToken, 'EX', 7 * 24 * 60 * 60); // 7天过期
  }

  private async invalidateRefreshToken(userId: number): Promise<void> {
    const key = `refresh_token:${userId}`;
    await this.redis.del(key);
  }

  private async isRefreshTokenValid(
    userId: number,
    refreshToken: string,
  ): Promise<boolean> {
    const storedToken = await this.redis.get(`refresh_token:${userId}`);
    return storedToken === refreshToken;
  }

  private setCookies(res: Response, refreshToken: string): void {
    res.cookie('refresh_token', refreshToken, {
      // 禁用js访问cookie, 防止XSS攻击
      httpOnly: true,
      // 只允许https访问cookie
      // 开发环境下关闭, 否则前端无法访问cookie
      secure: process.env.NODE_ENV === 'development' ? false : true,
      // 这个属性控制跨站请求时是否发送Cookie。
      // lax（默认值）: 表示在导航到目标站点的请求中发送Cookie，但不在POST请求中发送。
      // strict: 表示仅在相同站点（同源）的请求中发送Cookie，防止CSRF攻击。
      // none: 表示始终发送Cookie。必须配合secure属性使用。
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7天
    });
  }

  async signIn(
    loginName: string,
    pass: string,
    res: Response,
  ): Promise<Result<{ access_token: string; userInfo: any }>> {
    const result = await this.usersService.findByLoginName(loginName);
    const user = result.data;

    const isMatch = await bcrypt.compare(pass, user?.password);

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const { data: userRoles } = await this.usersRoleService.findRolesIdByUserId(
      user.id,
    );

    const payload = {
      user_id: user.id,
      loginName: user.loginName,
      tokenVersion: user.tokenVersion,
    };

    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: '30m',
    });
    const refresh_token = await this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    // 存储refresh token到Redis白名单
    await this.storeRefreshToken(user.id, refresh_token);

    // 只将refresh token存储在cookie中
    this.setCookies(res, refresh_token);

    const data = {
      access_token, // 返回access token供前端存储
      userInfo: {
        id: user.id,
        loginName: user.loginName,
        roles: userRoles,
      },
    };
    return new Result(data, '登录成功');
  }

  async refreshToken(refreshToken: string, res: Response) {
    try {
      const decoded = this.jwtService.verify(refreshToken);
      const userId = decoded.user_id;

      // 验证refresh token是否在白名单中
      const isValid = await this.isRefreshTokenValid(userId, refreshToken);
      if (!isValid) {
        throw new UnauthorizedException('Refresh token不在白名单中');
      }

      const { data: user } = await this.usersService.findById(userId);
      if (!user || user.status !== '1') {
        throw new UnauthorizedException('用户状态异常');
      }

      // 验证token版本
      if (decoded.tokenVersion !== user.tokenVersion) {
        throw new UnauthorizedException('Token版本已失效');
      }

      const payload = {
        user_id: user.id,
        loginName: user.loginName,
        tokenVersion: user.tokenVersion,
      };

      const access_token = this.jwtService.sign(payload, {
        expiresIn: '30m',
      });

      const new_refresh_token = this.jwtService.sign(payload, {
        expiresIn: '7d',
      });

      // 更新Redis中的refresh token
      await this.invalidateRefreshToken(userId);
      await this.storeRefreshToken(userId, new_refresh_token);

      // 更新refresh token cookie
      this.setCookies(res, new_refresh_token);

      return new Result({ access_token }, 'Token刷新成功');
    } catch (e) {
      throw new UnauthorizedException(
        e instanceof TokenExpiredError ? 'token已过期' : e,
      );
    }
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

    return new Result(data, '获取用户信息成功');
  }

  async logout(userId: number): Promise<void> {
    await this.invalidateRefreshToken(userId);
    // 增加token版本号，使所有现有token失效
    await this.usersService.incrementTokenVersion(userId);
  }
}
