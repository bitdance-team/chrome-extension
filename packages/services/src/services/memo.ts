import { getCurrentUser } from './user';
import { ObjectId } from './../models/base';
import { Memo } from './../models/memo';
import BaseDbService from './base'
import { IEntity, ITable, API } from '@byteinspire/db';
import { PageQuery } from '../models/base';

class MemoService extends BaseDbService<Memo> {
  findByUserPage(uid: string, pageArg: PageQuery) {
    return this.findPage(pageArg, this.table.where({ user: new ObjectId(uid) }).populate({
      ref: 'user',
      projection: ['_id', 'username', 'nickname', 'lastLogin', 'status']
    } as any))
  }
}

const memoService = new MemoService('memo')

export default memoService
