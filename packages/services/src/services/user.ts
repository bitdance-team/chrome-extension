import { User } from './../models/user';
import { WithId } from '../models/base';
import { Context } from 'koa-swagger-decorator';
import inspirecloud from '@byteinspire/api';
import { isNil } from 'lodash';

const userService = (inspirecloud as any).user

export const login = userService.login as (ctx: Context, username: string, password: string) => Promise<undefined>

export const register = userService.register as (ctx: Context, username: string, password: string) => Promise<undefined>

export const getCurrentUser = userService.current as (ctx: Context) => Promise<WithId<User> | undefined>

export const logout = userService.logout as (ctx: Context) => Promise<undefined>

export const updateNewPassword = userService.changePassword as (context: Context, newPassword: string, originPassword?: string) => Promise<any>;

export async function isLogin(ctx: Context) {
  try {
    return !isNil(await getCurrentUser(ctx))
  } catch (error) {
    return false
  }
}
