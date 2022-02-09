import { isNil } from 'lodash';
import { IEntity, ITable, API } from '@byteinspire/db';
import { Memo } from '../models/memo';
import { Context } from 'koa-swagger-decorator';
import inspirecloud from '@byteinspire/api'
import { multipageDbQuery } from '../utils/multipage';
import { PageQuery, ObjectIdType, ObjectId } from '../models/base';

export default class BaseDbService<T> {
  table: ITable<T>
  db: API = inspirecloud.db

  /**
   *
   * @param name 表名
   */
  constructor(name: string) {
    this.table = inspirecloud.db.table<T>(name)
  }

  /**
   * 查找多个
   * @returns
   */
  findMany(query: any): Promise<(T & IEntity)[]> {
    return query.find()
  }

  /**
   * 查找全部
   * @returns
   */
  findAll(): Promise<(T & IEntity)[]> {
    return this.findMany(this.table.where())
  }

  /**
   * 查找单个
   * @returns
   */
  findOne(id: string): Promise<(T & IEntity)> {
    const result = this.table.where({ _id: new ObjectId(id) }).findOne()
    if (isNil(result)) throw { status: 404, message: 'Not Found' }
    return result
  }

  /**
   * 分页查找
   * @returns
   */
  findPage(pageArg: PageQuery, query: any) {
    return multipageDbQuery(pageArg, query)
  }

  /**
   * 分页全部查找
   * @param pageArg
   * @returns
   */
  findAllPage(pageArg: PageQuery) {
    return this.findPage(pageArg, this.table.where())
  }

  /**
   * 创建单个
   * @returns
   */
  createOne(item: T): Promise<(T & IEntity)> {
    return this.table.save(item)
  }

  /**
   * 更新单个
   * @returns
   */
  async updateOne(item: Partial<T> & { _id: string }): Promise<T & IEntity> {
    const result = await this.findOne(item._id)

    for (const [k, v] of Object.entries(item) as [keyof (T & IEntity), any][]) {
      if (k === '_id' || k === 'createdAt' || k === 'updatedAt') continue
      result[k] = v
    }
    return this.table.save(result)
  }

  /**
   * 删除数据
   * @param id
   */
  async deleteOne(id: string) {
    const result = await this.table.where({ _id: new ObjectId(id) }).findOne()
    if (isNil(result)) throw { status: 404, message: 'Not Found' }
    return await this.table.delete([result])
  }

  /**
   * 删除多个数据
   * @param ids
   * @returns 成功删除数据的数目
   */
  async deleteMany(ids: string[]) {
    const result = await this.table.where({ _id: this.db.in(ids) }).find()
    const delRes = await this.table.delete(result)
    return (delRes as any).deletedCount
  }

}

