import { Request, Response, Router } from 'express'

import { serverConfig } from '../config'
import { safeRouteHandler, uploadHandler } from '../lib/express'
import { startProcessing } from './service'

const router = Router()

const uploadPdf = async (req: Request, res: Response) => {
  await startProcessing(`${serverConfig.uploadDestionation}${req.file.filename}`)

  res.redirect('/')
}

router.post(
  '/pdf',
  uploadHandler(serverConfig.uploadDestionation).single('file-to-upload'),
  safeRouteHandler(uploadPdf)
)

export default router
