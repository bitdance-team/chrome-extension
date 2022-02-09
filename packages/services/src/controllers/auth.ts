import { getCurrentUser, login, logout, register } from '../services/user';
import { Context, description, middlewares, request, security, securityAll, summary, swaggerClass, swaggerProperty, tagsAll } from 'koa-swagger-decorator';
import { authenticate, swaggerBody } from '../utils/swagger';
import { isNil } from 'lodash';
import { authentication } from '../utils/response';
@swaggerClass()
export class LoginRegDto {
  @swaggerProperty({ type: "string", required: true }) username = "";
  @swaggerProperty({ type: "string", required: true }) password = "";
};

@tagsAll('认证系统')
export default class Auth {

  @request('POST', '/auth/register')
  @summary('注册一个用户')
  @swaggerBody(LoginRegDto)
  static async register(ctx: Context) {
    const params = ctx.validatedBody as LoginRegDto;
    const data = await register(
      ctx,
      params.username,
      params.password
    );
    ctx.body = { code: 200, msg: '' }
  }

  @request('POST', '/auth/login')
  @summary('登录一个用户')
  @swaggerBody(LoginRegDto)
  static async login(ctx: Context) {
    const params = ctx.validatedBody as LoginRegDto;
    const data = await login(
      ctx,
      params.username,
      params.password
    );
    ctx.body = { code: 200, msg: '' }
  }

  @request('GET', '/auth/info')
  @summary('获取当前的用户信息')
  @authenticate
  static async info(ctx: Context) {
    const data = await getCurrentUser(ctx)
    ctx.body = { code: 200, msg: '', data };
  }

  @request('POST', '/auth/logout')
  @summary('登出当前系统')
  @security([{ session: [] }])
  static async logout(ctx: Context) {
    await logout(ctx)
    ctx.body = { code: 200, msg: '' };
  }
}
