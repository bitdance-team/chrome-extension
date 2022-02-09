import { getCurrentUser, login, logout, register } from '../services/user';
import { Context, description, middlewares, formData, request, security, securityAll, summary, swaggerClass, swaggerProperty, tagsAll } from 'koa-swagger-decorator';
import { swaggerBody } from '../utils/swagger';
import { isArray, isNil, uniqueId } from 'lodash';
import { authentication } from '../utils/response';
import { uploadFile } from '../services/files';
import { readFileSync } from 'fs'

@tagsAll('文件系统')
export default class RemoteFile {

  @request('POST', '/files')
  @summary('上传文件')
  @formData({ file: { type: 'file', required: true, description: '文件内容' } })
  @security([{ session: [] }])
  @middlewares([authentication])
  static async upload(ctx: Context) {
    const file = ctx.request.files?.['file']

    if (isNil(file)) throw { code: 400, msg: '未上传任何文件' }
    if (isArray(file)) throw { code: 400, msg: '只能上传一个文件' }

    const content = readFileSync(file.path)
    const data = await uploadFile(file.name || uniqueId('file'), content)

    ctx.body = { code: 200, msg: '', data }
  }

}
