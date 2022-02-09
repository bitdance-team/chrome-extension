import { Context, query } from 'koa-swagger-decorator';
import { PageQuery } from '../models/base';

// 用于分页的数据库查询辅助函数
export async function multipageDbQuery<T = any>(pageArg: PageQuery, query: any) {
  const { page = 1, pageSize = 10 } = pageArg

  if (page < 1 || pageSize < 1) throw { status: 400, message: '分页参数不合法' }

  const total = await query.count();
  const content = await query.skip((page - 1) * pageSize).limit(pageSize).find();
  return {
    total,
    page,
    pageSize,
    content: (content || []) as T[]
  }
}

//用于分页的HTTP Query查询
export function multipageHttpQuery() {
  return query(
    {
      page: { type: 'number', required: false, default: 1, description: 'type' },
      pageSize: { type: 'number', required: false, default: 10, description: 'type' }
    })
}
