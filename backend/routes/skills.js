const { Router } = require('express')

const { ensureAdmin } = require('../middlewares/auth')
const crud = require('../middlewares/crud')
const skills = require('../models/skills')

module.exports = (app) => {
  const router = Router()
  router.get('/', crud(skills).list)
  router.post('/', ensureAdmin, crud(skills).create)
  router.get('/:id', crud(skills).read)
  router.put('/:id', ensureAdmin, crud(skills).update)
  router.delete('/:id', ensureAdmin, crud(skills).delete)
  app.use('/skills', router)
  return app
}