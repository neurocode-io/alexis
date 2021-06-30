import { create } from './create/createUser'
import express, { Router } from 'express'

import { auth, safeRouteHandler } from '../../lib/express'
import { getCurrentUser } from './get/getUser'

const router = Router()

router.post('/users', express.json(), safeRouteHandler(create))
router.get('/me', auth, safeRouteHandler(getCurrentUser))

export default router
