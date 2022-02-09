import { Context } from 'koa-swagger-decorator';
import { UserContext } from '../models/base';
import { getCurrentUser, isLogin } from '../services/user';

// 处理请求中的错误
export async function errorHandler(ctx: Context, next: any) {
  try {
    await next();
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error = err as any
    // 抛出的错误可以附带 status 字段，代表 http 状态码
    // 若没有提供，则默认状态码为 500，代表服务器内部错误
    ctx.status = error.status || 500;
    ctx.body = { code: ctx.status, msg: error.message };
    console.error(err)
  }
}

/**
 * 对当前的请求进行登录验证，并注入用户信息到 ctx.user
 * @param ctx 请求上下文
 * @param next
 */
export async function authentication(ctx: UserContext, next: any) {
  try {
    const user = await getCurrentUser(ctx)
    if (!user) throw ""
    ctx.user = user
  } catch (error) {
    console.error(error)
    throw { status: 401, message: "用户未登录" }
  }
  await next()
}
