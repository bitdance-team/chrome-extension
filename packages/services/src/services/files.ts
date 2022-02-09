import inspirecloud from '@byteinspire/api';

const fileService = inspirecloud.file

const uploadFile = fileService.upload.bind(fileService) as any as (
  name: string,
  buffer: Buffer | string | { url: string },
) => Promise<{ url: string; id: string }>;

const downloadFile = fileService.download.bind(fileService)

const removeFile = fileService.delete.bind(fileService)

export { uploadFile, downloadFile, removeFile }
