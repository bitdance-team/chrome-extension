import { body, security } from 'koa-swagger-decorator'
import { authentication } from './response'

export function swaggerDocument(cls: any) {
  return (cls as any).swaggerDocument
}

export function swaggerBody<T extends object>(cls: T) {
  return body(swaggerDocument(cls))
}

export function authenticate(
  target: any,
  name: string,
  descriptor: PropertyDescriptor
) {

  if (!descriptor.value.middlewares) descriptor.value.middlewares = []
  descriptor.value.middlewares.push(authentication)

  // call other decorators
  security([{ session: [] }])(target, name, descriptor)
  return descriptor;
};
