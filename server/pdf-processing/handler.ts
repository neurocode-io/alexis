import { Request, Response, Router } from 'express'

import { serverConfig } from '../config'
import { auth, safeRouteHandler, uploadHandler } from '../lib/express'
import { startProcessing } from './service'

const router = Router()

const uploadPdf = async (req: Request, res: Response) => {
  const userId = req.session.userId

  await startProcessing(`${serverConfig.uploadDestionation}${req.file.filename}`, userId)

  res.redirect('/')
}

router.post(
  '/pdf',
  auth,
  uploadHandler(serverConfig.uploadDestionation).single('file-to-upload'),
  safeRouteHandler(uploadPdf)
)

export default router
