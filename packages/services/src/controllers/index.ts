import { Context, description, middlewares, request, security, summary, swaggerClass, swaggerProperty, tagsAll } from 'koa-swagger-decorator';
import { authentication } from '../utils/response';
import { authenticate, swaggerBody } from '../utils/swagger';

@tagsAll('测试')
export default class Index {
  @request('GET', '/test')
  @summary('测试服务器是否正常')
  static async test(ctx: Context) {
    ctx.body = { code: 200, msg: '', data: new Date() }
  }

  @request('GET', '/authtest')
  @summary('测试服务器是否正常')
  @authenticate
  static async authtest(ctx: Context) {
    ctx.body = { code: 200, msg: '', data: new Date() }
  }
}
