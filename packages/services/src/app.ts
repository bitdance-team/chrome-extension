import Koa from 'koa'
import koaBody from 'koa-body';
import router from './router';
import helmet from 'koa-helmet'
import koaBunyanLogger from 'koa-bunyan-logger'
import koaCors from 'koa2-cors';
import { errorHandler } from './utils/response'

const app = new Koa();

// 跨域请求设置
app.use(koaCors({
  origin: function (ctx) { //设置允许来自指定域名请求
    return '*'
  },
  maxAge: 5, //指定本次预检请求的有效期，单位为秒。
  credentials: true, //是否允许发送Cookie
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法'
  allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'x-tt-session-v2'], //设置服务器支持的所有头信息字段
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'] //设置获取其他自定义字段
}))

// 过滤不安全的请求内容
// app.use(helmet.contentSecurityPolicy());
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());

// 解析不同类别的请求
app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 30 * 1024 * 1024
  }
}));

// 请求日志
app.use(koaBunyanLogger());
app.use(koaBunyanLogger.requestIdContext());
app.use(koaBunyanLogger.requestLogger());


// 若后面的路由抛错，则封装为错误响应返回
app.use(errorHandler);

// 为应用使用路由定义
app.use(router.routes()).use(router.allowedMethods());
export { app }
