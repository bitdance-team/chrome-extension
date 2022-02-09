import { IEntity } from '@byteinspire/db';
import { User } from './user';
import { ObjectIdType } from './base';

export interface Memo {
  content: string;
  user: User
}
