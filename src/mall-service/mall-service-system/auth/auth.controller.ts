import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  Request,
  Logger,
  Inject,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators/metadata/public.decorator';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() user: Record<string, any>) {
    return this.authService.signIn(user.loginName, user.password);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return this.authService.getProfile(req);
  }
}
