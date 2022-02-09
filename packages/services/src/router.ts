import '@koa/router'

import { SwaggerRouter } from 'koa-swagger-decorator'
import path from 'path'

const router = new SwaggerRouter({ prefix: '/api' }) // extends from koa-router

// swagger docs avaliable at http://localhost:3000/api/swagger-html
router.swagger({
  title: 'BitDance浏览器插件后台服务',
  description: '请求认证头为 `x-tt-session-v2`',
  version: '1.0.0',
  prefix: '/api',
  swaggerHtmlEndpoint: '/swagger-html',
  swaggerJsonEndpoint: '/swagger-json',
  swaggerOptions: {
    securityDefinitions: {
      session: {
        type: 'apiKey',
        in: 'header',
        name: 'x-tt-session-v2',
      },
    },
  },
})

// mapDir will scan the input dir, and automatically call router.map to all Router Class
router.mapDir(path.resolve(__dirname, 'controllers'), {
  ignore: ["**.spec.ts", "**.d.ts"],
})

export default router
