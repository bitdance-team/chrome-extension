import { Context } from 'koa-swagger-decorator';
export type WithId<T extends object> = T & { _id: string }

import inspirecloud from '@byteinspire/api';
import { User } from './user';

export const ObjectId = inspirecloud.db.ObjectId

export type ObjectIdType = InstanceType<typeof ObjectId>

export interface PageQuery { page: number, pageSize: number }

export interface UserContext extends Context {
  user: WithId<User>
}
