import { getCurrentUser } from './../services/user';
import { Context, description, middlewares, path, request, security, summary, swaggerClass, swaggerProperty, tagsAll } from 'koa-swagger-decorator';
import { authentication } from '../utils/response';
import { authenticate, swaggerBody } from '../utils/swagger';
import { ObjectId, UserContext } from '../models/base';
import memoService from '../services/memo';
import { multipageHttpQuery } from '../utils/multipage';
import { User } from '../models/user';

export class CreateMemoDto {
  @swaggerProperty({ type: "string", required: true }) content = "";
};

@tagsAll('备忘录')
export default class Memo {

  @request('GET', '/memos')
  @summary('获取个人所有的备忘录')
  @authenticate
  @multipageHttpQuery()
  static async getAll(ctx: UserContext) {
    const data = await memoService.findByUserPage(ctx.user._id, ctx.validatedQuery)
    ctx.body = { code: 200, msg: '', data }
  }

  @request('POST', '/memos')
  @summary('创建一个备忘录')
  @authenticate
  @swaggerBody(CreateMemoDto)
  static async createOne(ctx: UserContext) {
    // ctx.user 获取的只是一个JSON字段，不支持数据库关联
    const user = await memoService.db.table<User>('_user').where({ _id: new ObjectId(ctx.user._id) }).projection({ username: 1, lastLogin: 1, status: 1 }).findOne()

    const data = await memoService.createOne({
      content: ctx.validatedBody.content,
      user
    })
    ctx.body = { code: 200, msg: '', data }
  }

  @request('DELETE', '/memos/{id}')
  @summary('删除一个备忘录')
  @authenticate
  @path({ id: { type: 'string', required: true, description: 'ID' } })
  static async deleteOne(ctx: UserContext) {
    await memoService.deleteOne(ctx.validatedParams.id)
    ctx.body = { code: 200, msg: '' }
  }

}
