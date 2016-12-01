const { path, memoize } = require('ramda');

const statusCodes = {
  list: 200,
  create: 201,
  read: 200,
  update: 204,
  delete: 204
};
const inputs = {
  list: ['req.query.filter'],
  create: ['req.body'],
  read: ['req.params.id'],
  update: ['req.params.id', 'req.body'],
  delete: ['req.params.id']
};

const getInputs = (data, inputs) => inputs.map((input) => path(input.split('.'), data))

module.exports = memoize(model => new Proxy({}, {
  get: (object, methodName) => (req, res, next) => 
    model[methodName](...getInputs({ req, res, next }, inputs[methodName]))
      .then(data => res.status(statusCodes[methodName]).json(data))
      .catch(({ message, stack }) => res.status(500).json({ message, stack }))
}));