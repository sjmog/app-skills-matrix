/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 69);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("ramda");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const jwt = __webpack_require__(65);
const database = __webpack_require__(4);
const adminUsers = __webpack_require__(27).adminUsers;
const R = __webpack_require__(0);

const isAdmin = (email) => R.contains(email, adminUsers);
const secret = process.env.JWT_SECRET;

module.exports = {
  sign: ({id, username}) => jwt.sign({ id, username }, secret),
  verify: token => new Promise((resolve, reject) =>
    jwt.verify(token, secret, (err, data) =>
      err ? reject(err) : resolve(data))),
  isAdmin,
  cookieName: 'skillsmatrix-auth'
};


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("bluebird");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const { MongoClient } = __webpack_require__(10);
const { memoize } = __webpack_require__(0);

const databaseUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/skillz';

const connect = memoize(() => MongoClient.connect(databaseUrl));
const getCollection = memoize(collection => connect().then(db => db.collection(collection)));

module.exports = {
  connect,
  collection: (collection) => new Proxy({}, {
    get: (object, methodName) => (...args) =>
      getCollection(collection)
        .then(collection => collection[methodName](...args))
  })
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__dirname) {const express = __webpack_require__(3);
const { compose } = __webpack_require__(0);
const exphbs  = __webpack_require__(64);

const [before, after] = __webpack_require__(32);
const routes = __webpack_require__(43);
const database = __webpack_require__(4);

const basePath = '/skillz';
const port = process.env.PORT || 3000;
const listen = app => app.listen(port, () =>
    console.log(`Skills Matrix listening on port ${port}`));
const addMiddleware = compose(listen, after, routes(basePath), before);

let app = express();

app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', __dirname + '/views');

module.exports = database.connect() && addMiddleware(app);

/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("supertest");

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const { ObjectId } = __webpack_require__(10);

const database = __webpack_require__(4);
const user = __webpack_require__(38);

const collection = database.collection('users');

collection.ensureIndex({ email: 1 }, { background: true });
collection.ensureIndex({ username: 1 }, { unique: true, background: true });
collection.ensureIndex({ mentorId: 1 }, { background: true });

module.exports = {
  addUser: ({ email, name, avatarUrl, username }) => {
    const changes = user.newUser(name, email, avatarUrl, username);
    return collection.updateOne({ username }, { $set: changes }, { upsert: true })
      .then(() => collection.findOne({ username }))
      .then(retrievedUser => user(retrievedUser))
  },
  getUserByUsername: (username) => {
    return collection.findOne({ username })
      .then((res) => res ? user(res) : null);
  },
  getUserById: (id) => {
    return collection.findOne({ _id: ObjectId(id) })
      .then((res) => res ? user(res) : null);
  },
  updateUser: (original, updates) => {
    return collection.updateOne({ _id: ObjectId(original.id) }, { $set: updates })
      .then(() => collection.findOne({ _id: ObjectId(original.id) }))
      .then((res) => res ? user(res) : null);
  },
  getAll: () => {
    return collection.find()
      .then((res) => res.toArray())
      .then((res) => res.map((doc) => user(doc)));
  },
  getByMentorId: (id) => {
    return collection.find({ mentorId: id })
      .then((res) => res.toArray())
      .then((res) => res.map((doc) => user(doc)))
  },
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const { ObjectId } = __webpack_require__(10);
const R = __webpack_require__(0);

const usersData = __webpack_require__(52);
const database = __webpack_require__(4);
const { encrypt, decrypt } = __webpack_require__(22);

const users = database.collection('users');
const templates = database.collection('templates');
const skills = database.collection('skills');
const evaluations = database.collection('evaluations');
const actions = database.collection('actions');

const prepopulateUsers = () => users.remove({}).then(() => users.insertMany(usersData));

module.exports = {
  prepopulateUsers,
  users,
  assignMentor: (userId, mentorId) => users.update({ _id: ObjectId(userId) }, { $set: { mentorId: String(mentorId) } }),
  templates,
  insertTemplate: (template) => templates.insertOne(Object.assign({}, template)),
  assignTemplate: (userId, templateId) => users.update({ _id: ObjectId(userId) }, { $set: { templateId: String(templateId) } }),
  skills,
  insertSkill: (skill) => skills.insertOne(Object.assign({}, skill)),
  evaluations,
  insertEvaluation: (evaluation, userId) => evaluations.insertOne(encrypt(Object.assign({}, evaluation, { user: { id: String(userId) } }))),
  getEvaluation: (evaluationId) => evaluations.findOne({ _id: ObjectId(evaluationId) }).then(decrypt),
  getEvaluations: () => evaluations.find({}).then((e) => e.toArray()).then(R.map(decrypt)),
  getAllActions: () => actions.find({}).then((e) => e.toArray()),
  insertAction: (userId) => (action) => actions.insertOne(Object.assign({}, action, { user: { id: String(userId) } })),
  clearDb: () => Promise.all([users.remove({}), templates.remove({}), skills.remove({}), evaluations.remove({}), actions.remove({})])
};


/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("chai");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("mongodb");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = Object.freeze({
  USER_EXISTS: (email) => ({ message: `User with email '${email}' already exists` }),
  MUST_BE_ADMIN: () => ({ message: 'Must be an admin to perform action' }),
  USER_NOT_FOUND: () => ({ message: 'User not found' }),
  TEMPLATE_NOT_FOUND: () => ({ message: 'Template not found' }),
  USER_HAS_NO_TEMPLATE: (username) => ({ message: `User '${username}' has not had a template selected` }),
  USER_HAS_NO_MENTOR: (username) => ({ message: `User '${username}' has not had a mentor selected` }),
  EVALUATION_NOT_FOUND: () => ({ message: 'Evaluation not found' }),
  SKILL_NOT_FOUND: () => ({ message: 'Skill not found' }),
  MUST_BE_SUBJECT_OF_EVALUATION_OR_MENTOR: () => ({ message: 'Only the person being evaluated and their mentor can view an evaluation' }),
  MUST_BE_LOGGED_IN: () => ({ message: 'You must be logged in to view this page' }),
  SUBJECT_CAN_ONLY_UPDATE_NEW_EVALUATION: () => ({ message: "You can't make any changes to this evaluation." }),
  MENTOR_REVIEW_COMPLETE: () => ({ message: 'This evaluation has been reviewed and is now complete.'}),
  MENTOR_CAN_ONLY_UPDATE_AFTER_SELF_EVALUATION: () => ({ message: "You can't update this evaluation until your mentee has completed their self-evaluation."}),
  ONLY_USER_AND_MENTOR_CAN_SEE_ACTIONS: () => ({ message: "You can't see actions for another user unless you are their mentor."}),
  USER_NOT_ADMIN: () => ({ message: "You must be an admin user to make this request"})
});

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

const auth = __webpack_require__(1);
const users = __webpack_require__(7);
const { MUST_BE_ADMIN, MUST_BE_LOGGED_IN } = __webpack_require__(11);

module.exports = {
  populateUser: (req, res, next) =>
    req.cookies[auth.cookieName] ?
      auth.verify(req.cookies[auth.cookieName])
        .then((data) =>
          users.getUserByUsername(data.username)
            .then((user) => {
              res.locals.user = user;
              next()
            }))
        .catch(next) :
      next(),
  ensureLoggedIn: (req, res, next) => {
    return !res.locals.user ? res.status(401).json(MUST_BE_LOGGED_IN()) : next();
  },
  ensureAdmin: (req, res, next) => {
    if (!res.locals.user) {
      return res.status(401).json(MUST_BE_LOGGED_IN())
    }
    res.locals.user && res.locals.user.isAdmin ?
      next() :
      res.status(403).json(MUST_BE_ADMIN())
  },
};


/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = [
	{
		"id": 1,
		"name": "Dragon Feeding",
		"criteria": "Can successfully feed their dragon",
		"type": "skill",
		"version": 1,
		"questions": [
			{
				"title": "Do you know where to get the dragon food?"
			},
			{
				"title": "Are you able to feed a dragon and retain your hands"
			}
		]
	},
	{
		"id": 2,
		"name": "Advanced knowledge of Dragon Flight",
		"criteria": "Is able to fly their dragon in all situations",
		"type": "skill",
		"version": 1,
		"questions": [
			{
				"title": "Are you able to fly your dragon in a hurricane?"
			},
			{
				"title": "Can you memoize your dragon?"
			}
		]
	},
	{
		"id": 3,
		"name": "Advanced knowledge of the Dark Arts",
		"criteria": "Can execute the Imperius Curse",
		"type": "skill",
		"version": 1,
		"questions": [
			{
				"title": "Can you speak parseltongue?"
			}
		]
	},
	{
		"id": 4,
		"name": "Working knowledge of the Dark Arts",
		"criteria": "Can execute the Toenail-growing hex",
		"type": "skill",
		"version": 1,
		"questions": [
			{
				"title": "Have you hexed anyone in the last month?"
			}
		]
	},
	{
		"id": 5,
		"name": "Powerful Sword Arm",
		"criteria": "Can chop a pumpkin in half with 1 slice",
		"type": "skill",
		"version": 1,
		"questions": [
			{
				"title": "Can you chop all the things?"
			},
			{
				"title": "Can you use multiple chopping devices?"
			}
		]
	},
	{
		"id": 6,
		"name": "Bash",
		"criteria": "Can smite enemies with a single bash",
		"type": "skill",
		"version": 1,
		"questions": [
			{
				"title": "Have you bashed all your enemies in the last month?"
			}
		]
	}
];

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = [
	{
		"id": "eng-nodejs",
		"name": "Node JS Dev",
		"version": 1,
		"categories": [
			"Magicness",
			"Dragon Flight"
		],
		"levels": [
			"Expert",
			"Novice"
		],
		"skillGroups": [
			{
				"category": "Dragon Flight",
				"level": "Novice",
				"skills": [
					1
				]
			},
			{
				"category": "Dragon Flight",
				"level": "Expert",
				"skills": [
					2
				]
			},
			{
				"category": "Magicness",
				"level": "Expert",
				"skills": [
					3
				]
			},
			{
				"category": "Magicness",
				"level": "Novice",
				"skills": [
					4
				]
			}
		]
	},
	{
		"id": "war-fighter",
		"name": "Warrior - Fighter Class",
		"version": 1,
		"categories": [
			"Magicness",
			"Fightyness",
			"Dragon Flight"
		],
		"levels": [
			"Expert",
			"Novice"
		],
		"skillGroups": [
			{
				"category": "Dragon Flight",
				"level": "Novice",
				"skills": [
					1
				]
			},
			{
				"category": "Dragon Flight",
				"level": "Expert",
				"skills": [
					2
				]
			},
			{
				"category": "Magicness",
				"level": "Expert",
				"skills": [
					3
				]
			},
			{
				"category": "Magicness",
				"level": "Novice",
				"skills": [
					4
				]
			},
			{
				"category": "Fightyness",
				"level": "Novice",
				"skills": [
					5
				]
			},
			{
				"category": "Fightyness",
				"level": "Novice",
				"skills": [
					6
				]
			}
		]
	}
];

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

const R = __webpack_require__(0);

const defaultHandler = {
  get: function (target, name) {
    return target.hasOwnProperty(name) ?
      target[name] :
      (req, res, next) => res.status(400).json({ message: `Requested action '${req.body.action}' does not exist` });
  }
};

module.exports = (handlerFunctions) => R.map((handler) => new Proxy(handler, defaultHandler), handlerFunctions);


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

const database = __webpack_require__(4);
const templatesCollection = database.collection('templates');
const skillsCollection = database.collection('skills');
const template = __webpack_require__(37);
const skills = __webpack_require__(36);
const skill = __webpack_require__(23);

skillsCollection.ensureIndex({ id: 1 }, { unique: true, background: true });
templatesCollection.ensureIndex({ id: 1}, { unique: true, background: true });

module.exports = {
  templates: {
    addTemplate: function ({ id, name, skillGroups, categories, levels }) {
      const newTemplate = template.newTemplate(id, name, skillGroups, levels, categories);
      return templatesCollection.updateOne({ id }, { $set: newTemplate }, { upsert: true })
        .then(() => templatesCollection.findOne({ id }))
        .then(retrievedTemplate => template(retrievedTemplate))
    },
    getById: function (id) {
      return templatesCollection.findOne({ id })
        .then((res) => res ? template(res) : null);
    },
    getAll: function () {
      return templatesCollection.find()
        .then((results) => results.toArray())
        .then((results) => results.map((doc) => template(doc)));
    },
    updateTemplate: function (original, updates) {
      delete updates._id;
      return templatesCollection.updateOne({ id: original.id }, { $set: updates })
        .then(() => templatesCollection.findOne({ id: original.id }))
        .then(updatedTemplate => template(updatedTemplate))
    },
  },
  skills: {
    addSkill: function ({ id, name, type, version, criteria, questions }) {
      const newSkill = skill.newSkill(id, name, type, version, criteria, questions);
      return skillsCollection.updateOne({ id }, { $set: newSkill }, { upsert: true })
        .then(() => skillsCollection.findOne({ id }))
        .then(retrievedSkill => skill(retrievedSkill))
    },
    getById: function (id) {
      return skillsCollection.findOne({ id })
        .then(res => res ? skill(res) : null);
    },
    updateSkill: function (original, updates) {
      delete updates._id;
      return skillsCollection.updateOne({ id: original.id }, { $set: updates })
        .then(() => skillsCollection.findOne({ id: original.id }))
        .then(updatedSkill => skill(updatedSkill))
    },
    getAll: function () {
      return skillsCollection.find()
        .then((results) => results.toArray())
        .then((results) => skills(results));
    }
  }
};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

const keymirror = __webpack_require__(20);
const R = __webpack_require__(0);

const skill = __webpack_require__(34);
const HOST = process.env.HOST;

const STATUS = keymirror({
  NEW: null,
  SELF_EVALUATION_COMPLETE: null,
  MENTOR_REVIEW_COMPLETE: null,
});

const VIEW = keymirror({
  SUBJECT: null,
  MENTOR: null,
  ADMIN: null,
});

const arrayToKeyedObject = (skills) => skills.reduce((acc, item) => Object.assign({}, acc, { [item.id]: item }), {});

const evaluation = ({ _id, user, createdDate, template, skillGroups, status, skills }) => {
  const metadata = {
    createdDate,
    evaluationUrl: `/evaluations/${_id}`,
    feedbackUrl: `/user/${user.id}/evaluations/${_id}/feedback`,
    objectivesUrl: `/user/${user.id}/evaluations/${_id}/objectives`,
    id: _id,
    usersName: user.name,
    status,
    templateName: template.name,
  };

  const viewModel = {
    id: _id,
    subject: user,
    status,
    template,
    skillGroups: arrayToKeyedObject(skillGroups),
    skills: arrayToKeyedObject(skills),
  };

  return Object.freeze({
    id: _id ? _id.toString() : null,
    user,
    createdDate,
    template,
    skillGroups,
    status,
    get dataModel() {
      return { user, createdDate, template, skillGroups, status, skills };
    },
    get subjectMetadataViewModel() {
      return Object.assign({}, metadata, { view: VIEW.SUBJECT });
    },
    get mentorMetadataViewModel() {
      return Object.assign({}, metadata, { view: VIEW.MENTOR });
    },
    get adminMetadataViewModel() {
      return Object.assign({}, metadata, { view: VIEW.ADMIN });
    },
    get viewModel() {
      return viewModel;
    },
    get subjectEvaluationViewModel() {
      return Object.assign({}, viewModel, { view: VIEW.SUBJECT });
    },
    get mentorEvaluationViewModel() {
      return Object.assign({}, viewModel, { view: VIEW.MENTOR });
    },
    get adminEvaluationViewModel() {
      return Object.assign({}, viewModel, { view: VIEW.ADMIN });
    },
    get newEvaluationEmail() {
      return {
        recipients: user.email,
        subject: 'A new evaluation has been triggered',
        body: `Please visit ${`${HOST}/#/evaluations/${_id}`} to complete your evaluation.`,
      }
    },
    get feedbackData() {
      return ({ id: _id.toString(), createdDate });
    },
    getSelfEvaluationCompleteEmail(mentor) {
      return {
        recipients: mentor.email,
        subject: `${user.name} has completed their self evaluation`,
        body: `Please book a meeting with them and and visit ${`${HOST}/#/evaluations/${_id}`} to review their evaluation.`,
      }
    },
    findSkill(skillId) {
      const val = R.find((skill) => skillId === skill.id, skills);
      return val ? skill(val) : null;
    },
    updateSkill(skillId, newSkillStatus) {
      return {
        id: _id,
        user,
        createdDate,
        template,
        skillGroups,
        skills: skills.map((s) => s.id === skillId ? skill(s).updateStatus(newSkillStatus) : s),
        status
      }
    },
    isNewEvaluation() {
      return status === STATUS.NEW
    },
    selfEvaluationComplete() {
      return {
        id: _id,
        user,
        createdDate,
        template,
        skillGroups,
        status: STATUS.SELF_EVALUATION_COMPLETE
      }
    },
    selfEvaluationCompleted() {
      return status === STATUS.SELF_EVALUATION_COMPLETE
    },
    mentorReviewComplete() {
      return {
        id: _id,
        user,
        createdDate,
        template,
        skillGroups,
        status: STATUS.MENTOR_REVIEW_COMPLETE,
      }
    },
    mentorReviewCompleted() {
      return status === STATUS.MENTOR_REVIEW_COMPLETE;
    },
    mergePreviousEvaluation(previousEvaluation) {
      const updateSkill = (skill) => {
        const previousSkill = previousEvaluation.findSkill(skill.id);
        if (!previousSkill) {
          return Object.assign({}, skill, { status: { previous: null, current: null } });
        }
        return Object.assign({}, skill, { status: { previous: previousSkill.currentStatus, current: previousSkill.statusForNextEvaluation } });
      };
      const updatedSkills = previousEvaluation ? R.map(updateSkill, skills) : skills;
      return evaluation({
        user,
        createdDate,
        template,
        skillGroups,
        skills: updatedSkills,
        status: STATUS.NEW,
      });
    }
  });
};

module.exports = evaluation;
module.exports.STATUS = STATUS;
module.exports.newEvaluation = (template, user, allSkills, date = new Date()) => {
  const { skillGroups, skills } = template.createSkillGroups(allSkills);
  return evaluation({
    user: user.evaluationData,
    createdDate: date,
    status: STATUS.NEW,
    template: template.evaluationData,
    skillGroups,
    skills,
  });
};




/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

const database = __webpack_require__(4);
const evaluationsCollection = database.collection('evaluations');
const { ObjectId } = __webpack_require__(10);

const evaluation = __webpack_require__(17);
const { encrypt, decrypt } = __webpack_require__(22);

evaluationsCollection.ensureIndex({ 'user.id': 1 }, { background: true });

module.exports = {
  addEvaluation: function (newEvaluation) {
    return evaluationsCollection.insertOne(encrypt(newEvaluation.dataModel))
      .then(({ insertedId }) => evaluationsCollection.findOne({ _id: new ObjectId(insertedId) }))
      .then((res) => res ? evaluation(decrypt(res)) : null);
  },
  importEvaluation: function (rawEvaluation) {
    return evaluationsCollection.insertOne(encrypt(rawEvaluation))
      .then(({ insertedId }) => evaluationsCollection.findOne({ _id: new ObjectId(insertedId) }))
      .then((res) => res ? evaluation(decrypt(res)) : null);
  },
  getEvaluationById: function (id) {
    return evaluationsCollection.findOne({ _id: ObjectId(id) })
      .then(res => res ? evaluation(decrypt(res)) : null);
  },
  getByUserId: function (userId) {
    return evaluationsCollection.find({ 'user.id': userId })
      .then(res => res.toArray())
      .then(res => res.map((e) => evaluation(decrypt(e))))
  },
  getLatestByUserId: function (userId) {
    return evaluationsCollection.findOne({ 'user.id': userId }, { sort: {'createdDate': -1}, limit: 1 })
      .then(res => res ? evaluation(decrypt(res)) : null);
  },
  updateEvaluation: function (updatedEvaluation) {
    return evaluationsCollection.updateOne(
      { _id: ObjectId(updatedEvaluation.id) },
      { $set: encrypt(updatedEvaluation) }
    )
      .then(() => evaluationsCollection.findOne({ _id: ObjectId(updatedEvaluation.id) }))
      .then((res) => res ? evaluation(decrypt(res)) : null)
  }
};


/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = [
	{
		"user": {
			"id": "user_id",
			"name": "Jake",
			"email": "jake@hello.com"
		},
		"createdDate": "new Date()",
		"status": "NEW",
		"template": {
			"id": "eng-nodejs",
			"name": "Node JS Dev",
			"version": 1,
			"categories": [
				"Magicness",
				"Dragon Flight"
			],
			"levels": [
				"Expert",
				"Novice"
			]
		},
		"skills": [
			{
				"id": 1,
				"name": "Dragon Feeding",
				"criteria": "Can successfully feed their dragon",
				"type": "skill",
				"version": 1,
				"questions": [
					{
						"title": "Do you know where to get the dragon food?"
					},
					{
						"title": "Are you able to feed a dragon and retain your hands"
					}
				],
				"status": {
					"previous": null,
					"current": null
				}
			},
			{
				"id": 2,
				"name": "Advanced knowledge of Dragon Flight",
				"criteria": "Is able to fly their dragon in all situations",
				"type": "skill",
				"version": 1,
				"questions": [
					{
						"title": "Are you able to fly your dragon in a hurricane?"
					},
					{
						"title": "Can you memoize your dragon?"
					}
				],
				"status": {
					"previous": null,
					"current": null
				}
			},
			{
				"id": 3,
				"name": "Advanced knowledge of the Dark Arts",
				"criteria": "Can execute the Imperius Curse",
				"type": "skill",
				"version": 1,
				"questions": [
					{
						"title": "Can you speak parseltongue?"
					}
				],
				"status": {
					"previous": null,
					"current": null
				}
			},
			{
				"id": 4,
				"name": "Working knowledge of the Dark Arts",
				"criteria": "Can execute the Toenail-growing hex",
				"type": "skill",
				"version": 1,
				"questions": [
					{
						"title": "Have you hexed anyone in the last month?"
					}
				],
				"status": {
					"previous": null,
					"current": null
				}
			}
		],
		"skillGroups": [
			{
				"id": 0,
				"level": "Novice",
				"category": "Dragon Flight",
				"skills": [
					1
				]
			},
			{
				"id": 1,
				"level": "Expert",
				"category": "Dragon Flight",
				"skills": [
					2
				]
			},
			{
				"id": 2,
				"level": "Expert",
				"category": "Magicness",
				"skills": [
					3
				]
			},
			{
				"id": 3,
				"level": "Novice",
				"category": "Magicness",
				"skills": [
					4
				]
			}
		]
	},
	{
		"user": {
			"id": "user_id",
			"name": "Jake",
			"email": "jake@hello.com"
		},
		"createdDate": "new Date()",
		"status": "NEW",
		"template": {
			"id": "eng-nodejs",
			"name": "Node JS Dev",
			"version": 1,
			"categories": [
				"Magicness",
				"Dragon Flight"
			],
			"levels": [
				"Expert",
				"Novice"
			]
		},
		"skills": [
			{
				"id": 1,
				"name": "Dragon Feeding",
				"criteria": "Can successfully feed their dragon",
				"type": "skill",
				"version": 1,
				"questions": [
					{
						"title": "Do you know where to get the dragon food?"
					},
					{
						"title": "Are you able to feed a dragon and retain your hands"
					}
				],
				"status": {
					"previous": null,
					"current": "ATTAINED"
				}
			},
			{
				"id": 2,
				"name": "Advanced knowledge of Dragon Flight",
				"criteria": "Is able to fly their dragon in all situations",
				"type": "skill",
				"version": 1,
				"questions": [
					{
						"title": "Are you able to fly your dragon in a hurricane?"
					},
					{
						"title": "Can you memoize your dragon?"
					}
				],
				"status": {
					"previous": null,
					"current": "FEEDBACK"
				}
			},
			{
				"id": 3,
				"name": "Advanced knowledge of the Dark Arts",
				"criteria": "Can execute the Imperius Curse",
				"type": "skill",
				"version": 1,
				"questions": [
					{
						"title": "Can you speak parseltongue?"
					}
				],
				"status": {
					"previous": null,
					"current": "OBJECTIVE"
				}
			},
			{
				"id": 4,
				"name": "Working knowledge of the Dark Arts",
				"criteria": "Can execute the Toenail-growing hex",
				"type": "skill",
				"version": 1,
				"questions": [
					{
						"title": "Have you hexed anyone in the last month?"
					}
				],
				"status": {
					"previous": null,
					"current": null
				}
			}
		],
		"skillGroups": [
			{
				"id": 0,
				"level": "Novice",
				"category": "Dragon Flight",
				"skills": [
					1
				]
			},
			{
				"id": 1,
				"level": "Expert",
				"category": "Dragon Flight",
				"skills": [
					2
				]
			},
			{
				"id": 2,
				"level": "Expert",
				"category": "Magicness",
				"skills": [
					3
				]
			},
			{
				"id": 3,
				"level": "Novice",
				"category": "Magicness",
				"skills": [
					4
				]
			}
		]
	},
	{
		"user": {
			"id": "user_id",
			"name": "Jake",
			"email": "jake@hello.com"
		},
		"createdDate": "new Date()",
		"status": "NEW",
		"template": {
			"id": "eng-nodejs",
			"name": "Node JS Dev",
			"version": 1,
			"categories": [
				"Magicness",
				"Dragon Flight"
			],
			"levels": [
				"Expert",
				"Novice"
			]
		},
		"skills": [
			{
				"id": 1,
				"name": "Dragon Feeding",
				"criteria": "Can successfully feed their dragon",
				"type": "skill",
				"version": 1,
				"questions": [
					{
						"title": "Do you know where to get the dragon food?"
					},
					{
						"title": "Are you able to feed a dragon and retain your hands"
					}
				],
				"status": {
					"previous": "ATTAINED",
					"current": "ATTAINED"
				}
			},
			{
				"id": 2,
				"name": "Advanced knowledge of Dragon Flight",
				"criteria": "Is able to fly their dragon in all situations",
				"type": "skill",
				"version": 1,
				"questions": [
					{
						"title": "Are you able to fly your dragon in a hurricane?"
					},
					{
						"title": "Can you memoize your dragon?"
					}
				],
				"status": {
					"previous": "FEEDBACK",
					"current": null
				}
			},
			{
				"id": 3,
				"name": "Advanced knowledge of the Dark Arts",
				"criteria": "Can execute the Imperius Curse",
				"type": "skill",
				"version": 1,
				"questions": [
					{
						"title": "Can you speak parseltongue?"
					}
				],
				"status": {
					"previous": "OBJECTIVE",
					"current": null
				}
			},
			{
				"id": 4,
				"name": "Working knowledge of the Dark Arts",
				"criteria": "Can execute the Toenail-growing hex",
				"type": "skill",
				"version": 1,
				"questions": [
					{
						"title": "Have you hexed anyone in the last month?"
					}
				],
				"status": {
					"previous": null,
					"current": null
				}
			}
		],
		"skillGroups": [
			{
				"id": 0,
				"level": "Novice",
				"category": "Dragon Flight",
				"skills": [
					1
				]
			},
			{
				"id": 1,
				"level": "Expert",
				"category": "Dragon Flight",
				"skills": [
					2
				]
			},
			{
				"id": 2,
				"level": "Expert",
				"category": "Magicness",
				"skills": [
					3
				]
			},
			{
				"id": 3,
				"level": "Novice",
				"category": "Magicness",
				"skills": [
					4
				]
			}
		]
	}
];

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = require("keymirror");

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

const { ObjectId } = __webpack_require__(10);

const database = __webpack_require__(4);
const action = __webpack_require__(33);

const collection = database.collection('actions');

collection.ensureIndex({ 'skill.id': 1 }, { background: true });
collection.ensureIndex({ 'evaluation.id': 1 }, { background: true });
collection.ensureIndex({ 'user.id': 1 }, { background: true });
collection.ensureIndex({ 'type': 1 }, { background: true });
collection.ensureIndex({ 'skill.id': 1, 'evaluation.id': 1, 'user.id': 1, 'type': 1 }, { background: true, unique: true });

module.exports = {
  addAction: (type, user, skill, evaluation) => {
    const changes = action.newAction(type, user, skill, evaluation);
    return collection.insertOne(changes)
      .then(({ insertedId }) => collection.findOne({ _id: new ObjectId(insertedId) }))
      .then(retrievedAction => action(retrievedAction))
  },
  removeAction: (type, userId, skillId, evaluationId) => {
    return collection.deleteOne({ 'user.id': userId, 'skill.id': skillId, 'evaluation.id': evaluationId, type });
  },
  find: (userId, evaluationId, type) => {
    const query = { 'user.id': userId };
    if (evaluationId) {
      query['evaluation.id'] = evaluationId;
    }
    if (type) {
      query['type'] = type;
    }
    return collection.find(query).then((a) => a.toArray()).then(list => list.map(action));
  }
};


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

const crypto = __webpack_require__(62);

const encryptionpassword = process.env.ENCRYPTION_PASSWORD;

module.exports.encrypt = (changes) => {
  if (!Boolean(changes.skills)) {
    return changes;
  }
  const cipher = crypto.createCipher('aes192', encryptionpassword);
  let encryptedSkills = cipher.update(JSON.stringify(changes.skills), 'utf8', 'hex');
  encryptedSkills += cipher.final('hex');

  return Object.assign({}, changes, { skills: null, encryptedSkills })
};

module.exports.decrypt = (fromDb) => {
  const decipher = crypto.createDecipher('aes192', encryptionpassword);
  let decrypted = decipher.update(fromDb.encryptedSkills, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return Object.assign({}, fromDb, { skills: JSON.parse(decrypted), encryptedSkills: null })
};


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

const keymirror = __webpack_require__(20);

const skill = ({ id, name, version, criteria, type, questions }) => Object.freeze({
  id,
  get viewModel() {
    return { id, name };
  },
  get evaluationData() {
    return { id, name, version, criteria, type, questions };
  }
});

module.exports = skill;
module.exports.newSkill = (id, name, type, version = 1, criteria, questions) =>
  ({
    id,
    name,
    type,
    version,
    criteria,
    questions,
    createdDate: new Date()
  });


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

const mailgun = __webpack_require__(46);
const ses = __webpack_require__(47);

const MAIL_PROVIDER = process.env.MAIL_PROVIDER;

const providers = {
  mailgun: mailgun.sendMail,
  ses: ses.sendMail,
};

module.exports.sendMail = ({ recipients, subject, body }) => {
  const emailProviderSendMailFn = providers[MAIL_PROVIDER];
  if (!emailProviderSendMailFn) {
    return Promise.resolve({});
  }

  return emailProviderSendMailFn({ recipients, subject, body }).catch(console.error);
};


/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = require("moment");

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./actions.js": 48,
	"./auth.js": 49,
	"./evaluations.js": 50,
	"./initialClientState.test.js": 53,
	"./matrices.js": 54,
	"./users.js": 55,
	"./usersEvaluations.js": 56
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 26;


/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = {
	"adminUsers": [
		"dmorgantini@gmail.com",
		"charles.harris@tesglobal.com"
	]
};

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

const Promise = __webpack_require__(2);

const createHandler = __webpack_require__(15);

const actions = __webpack_require__(21);
const { getUserById } = __webpack_require__(7);
const { ONLY_USER_AND_MENTOR_CAN_SEE_ACTIONS } = __webpack_require__(11);

const handlerFunctions = Object.freeze({
  actions: {
    find: (req, res, next) => {
      const { evaluationId, type } = req.query;
      const { userId } = req.params;
      const { user } = res.locals;

      if (user.id === userId) {
        return Promise.try(() => actions.find(userId, evaluationId, type))
          .then((actions) => res.status(200).json(actions.map((action) => action.viewModel)))
          .catch(next);
      }

      return getUserById(userId)
        .then(({ mentorId }) =>
          (user.id === mentorId
            ? Promise.try(() => actions.find(userId, evaluationId, type))
                .then((actions) => res.status(200).json(actions.map((action) => action.viewModel)))
                .catch(next)
            : res.status(403).json(ONLY_USER_AND_MENTOR_CAN_SEE_ACTIONS())));
    },
  }
});

module.exports = createHandler(handlerFunctions);


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

const Promise = __webpack_require__(2);
const R = __webpack_require__(0);

const createHandler = __webpack_require__(15);

const { getEvaluationById, updateEvaluation, importEvaluation } = __webpack_require__(18);
const { templates } = __webpack_require__(16);
const { getUserById, getUserByUsername } = __webpack_require__(7);
const actions = __webpack_require__(21);

const { sendMail } = __webpack_require__(24);

const {
  EVALUATION_NOT_FOUND,
  SKILL_NOT_FOUND,
  MUST_BE_SUBJECT_OF_EVALUATION_OR_MENTOR,
  MUST_BE_LOGGED_IN,
  SUBJECT_CAN_ONLY_UPDATE_NEW_EVALUATION,
  MENTOR_REVIEW_COMPLETE,
  MENTOR_CAN_ONLY_UPDATE_AFTER_SELF_EVALUATION,
  USER_NOT_FOUND,
  TEMPLATE_NOT_FOUND,
  USER_NOT_ADMIN,
} = __webpack_require__(11);


const addActions = (user, skill, evaluation, newStatus) => {
  const actionToAdd = skill.addAction(newStatus);
  const actionToRemove = skill.removeAction(newStatus);
  const fns = [];
  if (actionToAdd) {
    fns.push(actions.addAction(actionToAdd, user, skill, evaluation));
  }
  if (actionToRemove) {
    fns.push(actions.removeAction(actionToRemove, user.id, skill.id, evaluation.id));
  }
  return Promise.all(fns);
};

const handlerFunctions = Object.freeze({
  evaluations: {
    import: (req, res, next) => {
      const { evaluation, username, template } = req.body;
      Promise.all([getUserByUsername(username), templates.getById(template)])
        .then(([user, template]) => {
          if (!user) {
            return res.status(404).json(USER_NOT_FOUND());
          }
          if (!template) {
            return res.status(404).json(TEMPLATE_NOT_FOUND());
          }

          evaluation.user = user.evaluationData;
          evaluation.template = template.evaluationData;

          if (template === 'eng-nodejs') {
            // have to map drupal skills to node skills :-(
            const badSkill = R.find((skill) => skill.id === 32, evaluation.skills);
            badSkill.id = 249;
            const badSkillGroup = R.find((skillGroup) => skillGroup.category === 'Technical Skill' && skillGroup.level === 'Experienced Beginner');
            badSkillGroup.skills = [259].concat(R.filter((skillId) => skillId !== 32, badSkillGroup.skills));
          }

          return importEvaluation(evaluation)
            .then(() => {
              return res.status(204).send();
            });
        })
        .catch(next);
    },
  },
  evaluation: {
    retrieve: (req, res, next) => {
      const { evaluationId } = req.params;
      const { user } = res.locals;

      Promise.try(() => getEvaluationById(evaluationId))
        .then(evaluation => {
          if (!evaluation) {
            return res.status(404).json(EVALUATION_NOT_FOUND());
          }

          if (!user) {
            return res.status(401).json(MUST_BE_LOGGED_IN());
          }

          if (user.id === evaluation.user.id) {
            return res.status(200).json(evaluation.subjectEvaluationViewModel);
          }

          return getUserById(evaluation.user.id)
            .then(({ mentorId }) => {
              if (user.id === mentorId) {
                return res.status(200).json(evaluation.mentorEvaluationViewModel)
              }

              if (user.isAdmin) {
                return res.status(200).json(evaluation.adminEvaluationViewModel)
              }

              return res.status(403).json(MUST_BE_SUBJECT_OF_EVALUATION_OR_MENTOR())
            })
        })
        .catch(next);
    },
    subjectUpdateSkillStatus: (req, res, next) => {
      const { evaluationId } = req.params;
      const { skillId, status } = req.body;
      const { user } = res.locals;

      getEvaluationById(evaluationId)
        .then((evaluation) => {
          if (!evaluation) {
            return res.status(404).json(EVALUATION_NOT_FOUND());
          }

          if (!user) {
            return res.status(401).json(MUST_BE_LOGGED_IN());
          }

          if (user.id !== evaluation.user.id) {
            return res.status(403).json(MUST_BE_SUBJECT_OF_EVALUATION_OR_MENTOR());
          }

          const skill = evaluation.findSkill(skillId);
          if (!skill) {
            return res.status(400).json(SKILL_NOT_FOUND());
          }

          return evaluation.isNewEvaluation()
            ? updateEvaluation(evaluation.updateSkill(skillId, status))
              .then(() => addActions(user, skill, evaluation, status))
              .then(() => res.sendStatus(204))
            : res.status(403).json(SUBJECT_CAN_ONLY_UPDATE_NEW_EVALUATION());
        })
        .catch(next)
    },
    mentorUpdateSkillStatus: (req, res, next) => {
      const { evaluationId } = req.params;
      const { skillId, status } = req.body;
      const { user } = res.locals;

      Promise.try(() => getEvaluationById(evaluationId))
        .then((evaluation) => {
          if (!evaluation) {
            return res.status(404).json(EVALUATION_NOT_FOUND());
          }

          if (!user) {
            return res.status(401).json(MUST_BE_LOGGED_IN());
          }

          const skill = evaluation.findSkill(skillId);
          if (!skill) {
            return res.status(400).json(SKILL_NOT_FOUND());
          }

          return getUserById(evaluation.user.id)
            .then((evalUser) => {
              if (user.id !== evalUser.mentorId) {
                return res.status(403).json(MUST_BE_SUBJECT_OF_EVALUATION_OR_MENTOR());
              }

              return evaluation.selfEvaluationCompleted()
                ? updateEvaluation(evaluation.updateSkill(skillId, status))
                  .then(addActions(evalUser, skill, evaluation, status))
                  .then(() => res.sendStatus(204))
                : res.status(403).json(MENTOR_CAN_ONLY_UPDATE_AFTER_SELF_EVALUATION());
            })
        })
        .catch(next)
    },
    adminUpdateSkillStatus: (req, res, next) => {
      const { evaluationId } = req.params;
      const { skillId, status } = req.body;
      const { user } = res.locals;

      Promise.try(() => getEvaluationById(evaluationId))
        .then((evaluation) => {
          if (!evaluation) {
            return res.status(404).json(EVALUATION_NOT_FOUND());
          }

          if (!user) {
            return res.status(401).json(MUST_BE_LOGGED_IN());
          }

          const skill = evaluation.findSkill(skillId);
          if (!skill) {
            return res.status(400).json(SKILL_NOT_FOUND());
          }

          if (user.isAdmin) {
            return updateEvaluation(evaluation.updateSkill(skillId, status))
              .then(() => addActions(user, skill, evaluation, status))
              .then(() => res.sendStatus(204))
          }

          return res.status(403).json(USER_NOT_ADMIN());
        })
        .catch(next)
    },
    complete: (req, res, next) => {
      const { evaluationId } = req.params;
      const { user } = res.locals;

      Promise.try(() => getEvaluationById(evaluationId))
        .then((evaluation) => {
          if (!evaluation) {
            return res.status(404).json(EVALUATION_NOT_FOUND());
          }

          if (!user) {
            return res.status(401).json(MUST_BE_LOGGED_IN());
          }

          if (evaluation.mentorReviewCompleted()) {
            return res.status(403).json(MENTOR_REVIEW_COMPLETE())
          }

          return getUserById(evaluation.user.id)
            .then(({ mentorId }) => {

              if (user.id === evaluation.user.id) {
                const completedApplication = evaluation.selfEvaluationComplete();
                return evaluation.isNewEvaluation()
                  ? Promise.all([updateEvaluation(completedApplication), getUserById(mentorId)])
                    .then(([updatedEvaluation, mentor]) => {
                      sendMail(updatedEvaluation.getSelfEvaluationCompleteEmail(mentor));
                      res.status(200).json({ status: updatedEvaluation.status })
                    })
                  : res.status(403).json(SUBJECT_CAN_ONLY_UPDATE_NEW_EVALUATION());
              }

              if (user.id !== mentorId) {
                return res.status(403).json(MUST_BE_SUBJECT_OF_EVALUATION_OR_MENTOR());
              }

              return evaluation.selfEvaluationCompleted()
                ? updateEvaluation(evaluation.mentorReviewComplete())
                  .then((updatedEvaluation) => res.status(200).json({ status: updatedEvaluation.status }))
                : res.status(403).json(MENTOR_CAN_ONLY_UPDATE_AFTER_SELF_EVALUATION())
            });
        })
        .catch(next);
    }
  }
});

module.exports = createHandler(handlerFunctions);


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

const Promise = __webpack_require__(2);

const { templates, skills } = __webpack_require__(16);
const createHandler = __webpack_require__(15);
const { TEMPLATE_NOT_FOUND } = __webpack_require__(11);

const handlerFunctions = Object.freeze({
  templates: {
    save: (req, res, next) => {
      Promise.try(() => JSON.parse(req.body.template))
        .then((template) =>
          templates.getById(template.id)
            .then(retrievedTemplate =>
              (retrievedTemplate
                ? templates.updateTemplate(retrievedTemplate, template)
                : templates.addTemplate(template)))
            .then(template => res.status(201).json(template.viewModel)))
        .catch(next);

    },
    retrieve: (req, res, next) => {
      Promise.try(() => templates.getById(req.params.templateId))
        .then((template) => {
          if (!template) {
            return res.status(404).json(TEMPLATE_NOT_FOUND())
          }
          return res.status(200).json(template.normalizedViewModel)
        })
        .catch(next);
    }
  },
  skills: {
    save: (req, res, next) => {
      Promise.try(() => JSON.parse(req.body.skill))
        .then((newSkills) =>
          Promise.map([].concat(newSkills),
            (skill) => skills.getById(skill.id)
              .then(retrievedSkill =>
                (retrievedSkill
                  ? skills.updateSkill(retrievedSkill, skill)
                  : skills.addSkill(skill))))
            .then(skill => res.status(201).json(skill.viewModel)))
        .catch(next);
    },
    getAll: (req, res, next) =>
      Promise.try(() => skills.getAll())
        .then((allSkills) => res.status(200).json(allSkills.viewModel))
        .catch(next),
  }
});

module.exports = createHandler(handlerFunctions);


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

const Promise = __webpack_require__(2);

const users = __webpack_require__(7);
const { templates, skills } = __webpack_require__(16);
const { newEvaluation } = __webpack_require__(17);
const evaluations = __webpack_require__(18);
const createHandler = __webpack_require__(15);
const { sendMail } = __webpack_require__(24);
const { USER_EXISTS, MUST_BE_ADMIN, USER_NOT_FOUND, TEMPLATE_NOT_FOUND, USER_HAS_NO_TEMPLATE, USER_HAS_NO_MENTOR } = __webpack_require__(11);

const handlerFunctions = Object.freeze({
  users: {
    create: (req, res, next) => {
      Promise.try(() => users.getUserByUsername(req.body.username))
        .then((user) => {
          if (user) {
            return res.status(409).json(USER_EXISTS(req.body.username));
          }
          return users.addUser(req.body)
            .then((user) => res.status(201).send(user.manageUserViewModel))

        })
        .catch(next);
    }
  },
  user: {
    selectMentor: (req, res, next) => {
      const { user } = res.locals;
      if (!user || !user.isAdmin) {
        return res.status(403).json(MUST_BE_ADMIN());
      }
      Promise.try(() => users.getUserById(req.params.userId))
        .then((user) => {
          if (!user) {
            return res.status(404).json(USER_NOT_FOUND());
          }
          const changes = user.setMentor(req.body.mentorId);
          if (changes.error) {
            return res.status(400).json(changes);
          }
          return users.updateUser(user, changes)
            .then((updatedUser) => res.status(200).json(updatedUser.manageUserViewModel));
        })
        .catch(next);
    },
    selectTemplate: (req, res, next) => {
      const { user } = res.locals;
      if (!user || !user.isAdmin) {
        return res.status(403).json(MUST_BE_ADMIN());
      }
      Promise.all([users.getUserById(req.params.userId), templates.getById(req.body.templateId)])
        .then(([user, template]) => {
          if (!user) {
            return res.status(404).json(USER_NOT_FOUND());
          }
          if (!template) {
            return res.status(400).json(TEMPLATE_NOT_FOUND());
          }

          const changes = user.setTemplate(req.body.templateId);
          return users.updateUser(user, changes)
            .then((updatedUser) => res.status(200).json(updatedUser.manageUserViewModel));
        })
        .catch(next);
    },
  },
  evaluations: {
    create: (req, res, next) => {
      Promise.try(() => users.getUserById(req.params.userId))
        .then((user) => {
          if (!user) {
            return res.status(404).json(USER_NOT_FOUND());
          }
          if (!user.hasTemplate) {
            return res.status(400).json(USER_HAS_NO_TEMPLATE(user.manageUserViewModel.name));
          }
          if (!user.hasMentor) {
            return res.status(400).json(USER_HAS_NO_MENTOR(user.manageUserViewModel.name));
          }

          return Promise.all([templates.getById(user.templateId), skills.getAll(), evaluations.getLatestByUserId(user.id)])
            .then(([template, allSkills, latestEvaluation]) => {
              const userEvaluation = newEvaluation(template, user, allSkills);
              const mergedEvaluation = userEvaluation.mergePreviousEvaluation(latestEvaluation);
              return evaluations.addEvaluation(mergedEvaluation);
            })
            .then((newEval) => {
              sendMail(newEval.newEvaluationEmail);
              res.status(201).json(newEval.viewModel);

            });
        })
        .catch(next);
    }
  },
});

module.exports = createHandler(handlerFunctions);


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

const express = __webpack_require__(3);
const bodyParser = __webpack_require__(60);
const cookieParser = __webpack_require__(61);
const morgan = __webpack_require__(66);
const debug = __webpack_require__(63)('skillz:http');

const { populateUser } = __webpack_require__(12);

const before = [
  express.static('frontend/dist'),
  debug.enabled ? morgan('dev') : (req, res, next) => next(),
  bodyParser.json(),
  cookieParser(),
  populateUser
];

const after = [
  (req, res, next) => res.status(404).end()
];

const use = app => middleware => app.use(middleware);

module.exports = [
  app => before.forEach(use(app)) || app,
  app => after.forEach(use(app)) || app
];


/***/ }),
/* 33 */
/***/ (function(module, exports) {

module.exports = ({ type, user, skill, evaluation }) => Object.freeze({
  get viewModel() {
    // may want to map as these aren't really appropriate for a viewmodel (up to you @charlie)
    return ({ type, user, skill, evaluation });
  }
});

module.exports.newAction = (type, user, skill, evaluation) => {
  return ({
    type,
    user: user.feedbackData,
    skill: skill.feedbackData,
    evaluation: evaluation.feedbackData,
    createdDate: new Date(),
  });
};



/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

const keymirror = __webpack_require__(20);

const SKILL_STATUS = keymirror({
  ATTAINED: null,
  NOT_ATTAINED: null,
  FEEDBACK: null,
  OBJECTIVE: null
});

const STATUS_WITH_ACTION = keymirror({
  FEEDBACK: null,
  OBJECTIVE: null,
});

module.exports = ({ id, name, criteria, type, questions, status }) => ({
  id,
  get currentStatus() {
    return status.current;
  },
  get statusForNextEvaluation() {
    return status.current === SKILL_STATUS.ATTAINED ? SKILL_STATUS.ATTAINED : null
  },
  get feedbackData() {
    return ({ id, name, criteria });
  },
  addAction(newStatus) {
    return (STATUS_WITH_ACTION[newStatus] && status.current !== newStatus) && STATUS_WITH_ACTION[newStatus];
  },
  removeAction(newStatus) {
    return (STATUS_WITH_ACTION[status.current] && status.current !== newStatus) && STATUS_WITH_ACTION[status.current];
  },
  updateStatus(newStatus) {
    return {
      id,
      name,
      criteria,
      type,
      questions,
      status: {
        previous: status.previous,
        current: newStatus,
      }
    }
  }
});

module.exports.SKILL_STATUS = SKILL_STATUS;


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

const R = __webpack_require__(0);
const Promise = __webpack_require__(2);
const moment = __webpack_require__(25);

const users = __webpack_require__(7);
const { templates } = __webpack_require__(16);
const evaluations = __webpack_require__(18);

const sortNewestToOldest = evaluations => evaluations.sort((a, b) => moment(a.createdDate).isBefore(b.createdDate));

const getEvaluations = (id) =>
  evaluations.getByUserId(id)
    .then(sortNewestToOldest);

const getSubjectEvaluations = (id) =>
  getEvaluations(id)
    .then((evaluations) => evaluations.map((evaluation) => evaluation.subjectMetadataViewModel));

const getMenteeEvaluations = (id) =>
  Promise.map(
    users.getByMentorId(id),
    ({ id, name, username }) =>
      getEvaluations(id)
        .then((evaluations) => evaluations.map((evaluation) => evaluation.mentorMetadataViewModel))
        .then(evaluations => ({ name: name || username, evaluations }))
  );

const augmentWithEvaluations = (users) =>
  Promise.map(
    users,
    (user) =>
      getEvaluations(user.id)
        .then((evaluations) => evaluations.map((evaluation) => evaluation.adminMetadataViewModel))
        .then((evaluations) => Object.assign({}, user.manageUserViewModel, { evaluations }))
  );

const adminClientState = () => {
  return Promise.all([users.getAll(), templates.getAll()])
    .then(([allUsers = [], allTemplates = []]) =>
      augmentWithEvaluations(allUsers)
        .then((users) => ({
            users: {
              users,
              newEvaluations: []
            },
            matrices: {
              templates: R.map((domainTemplate) => domainTemplate.viewModel, allTemplates),
            },
          })
        ));
};

const clientState = (user) =>
  user ?
    Promise.all([
        users.getUserById(user.mentorId),
        templates.getById(user.templateId),
        getSubjectEvaluations(user.id),
        getMenteeEvaluations(user.id)
      ])
      .then(([mentor, template, evaluations, menteeEvaluations]) =>
        ({
          user: {
            userDetails: user ? user.userDetailsViewModel : null,
            mentorDetails: mentor ? mentor.userDetailsViewModel : null,
            template: template ? template.viewModel : null,
            evaluations,
            menteeEvaluations,
          }
        }))
    :
    Promise.resolve({ user: {} });

module.exports = {
  adminClientState,
  clientState,
};


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

const R = __webpack_require__(0);

const skill = __webpack_require__(23);

const skills = (skillsArray) => {
  const skillsMap = skillsArray.reduce((acc, aSkill) => Object.assign({}, acc, { [aSkill.id]: skill(aSkill) }), {});
  const skillsToMap = {
    get: (target, name) => target.hasOwnProperty(name) ? target[name] : skillsMap[name]
  };

  const skillsFunctions = {
    get viewModel() {
      return R.map((skill) => skill.evaluationData, skillsMap);
    }
  };

  return new Proxy(skillsFunctions, skillsToMap);
};

module.exports = skills;


/***/ }),
/* 37 */
/***/ (function(module, exports) {

const template = ({ id, name, version, categories, levels, skillGroups }) => Object.freeze({
  id,
  skillGroups,
  get viewModel() {
    return { id, name };
  },
  get normalizedViewModel() {
    const skillGroupsWithId = skillGroups
      .map((skillGroup, index) => Object.assign({}, skillGroup, { id: index }));

    const indexedSkillGroups = skillGroupsWithId
      .reduce((collector, skillGroup) => {
        collector[skillGroup.id] = skillGroup;
        return collector;
      }, {});

    return { id, name, version, categories, levels, skillGroups: indexedSkillGroups };
  },
  get evaluationData() {
    return { id, name, version, categories, levels }
  },
  get userDetailsViewModel() {
    return { name };
  },
  createSkillGroups: function (allSkills) {
    let skills = [];
    const newSkillGroups = skillGroups.map((skillGroup, index) => {
      skills = skills.concat(skillGroup.skills.map((skillId) =>
        Object.assign({}, allSkills[skillId].evaluationData, { status: { previous: null, current: null } })));
      return ({
        id: index,
        category: skillGroup.category,
        level: skillGroup.level,
        skills: skillGroup.skills,
      });
    });
    return { skills, skillGroups: newSkillGroups }
  },
});

module.exports = template;
module.exports.newTemplate = (id, name, skillGroups, levels, categories) =>
  ({
    id,
    name,
    skillGroups,
    levels,
    categories,
    createdDate: new Date()
  });


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

const R = __webpack_require__(0);
const auth = __webpack_require__(1);

const user = ({ _id, name, email, username, createdDate, modifiedDate, templateId, mentorId, avatarUrl }) => Object.freeze({
  id: _id.toString(),
  name,
  username,
  templateId,
  mentorId,
  get email() {
    return email;
  },
  get isAdmin() {
    return auth.isAdmin(email);
  },
  get manageUserViewModel() {
    return ({ id: _id.toString(), username, name, email, mentorId, templateId });
  },
  get feedbackData() {
    return ({ id: _id.toString(), name: name || username, mentorId });
  },
  get signingData() {
    return ({ id: _id.toString(), username });
  },
  get evaluationData() {
    return ({ id: _id.toString(), name: name || username, email });
  },
  get userDetailsViewModel() {
    return ({ id: _id.toString(), name, username, avatarUrl, email, mentorId, templateId });
  },
  hasTemplate: Boolean(templateId),
  hasMentor: Boolean(mentorId),
  setMentor(newMentorId) {
    if (newMentorId === _id.toString()) {
      return { error: true, message: `User '${newMentorId}' can not mentor themselves` };
    }

    return { mentorId: newMentorId, modifiedDate: new Date() };
  },
  setTemplate(templateId) {
    return { templateId, modifiedDate: new Date() };
  },
  toString() {
    return JSON.stringify(this);
  }
});

module.exports = user;
module.exports.newUser = (name, email, avatarUrl, username) => ({ username, name, email, createdDate: new Date(), avatarUrl });



/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

const { Router } = __webpack_require__(3);

const { actions } = __webpack_require__(28);
const { ensureLoggedIn } = __webpack_require__(12);

module.exports = (app) => {
  const router = Router();
  router.get('/:userId/actions', ensureLoggedIn, (req, res, next) => actions.find(req, res, next));
  app.use('/users', router);
  return app
};


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

const authom = __webpack_require__(57);

const auth = __webpack_require__(1);
const users = __webpack_require__(7);

authom.createServer({
  service: 'github',
  id: process.env.GITHUB_ID,
  secret: process.env.GITHUB_SECRET,
  scope: ['user:email']
});

authom.on('auth', (req, res, { data }) =>
  users.getUserByUsername(data.login)
    .then((user) => {
      const githubData = { email: data.email, name: data.name, avatarUrl: data.avatar_url, username: data.login };
      const userFn = !user ? users.addUser(githubData) : Promise.resolve(user);
      userFn.then((user) => auth.sign(user.signingData))
        .then((token) => {
          res.cookie(auth.cookieName, token);
          res.redirect('/')
        })
        .catch(({ message, stack }) =>
          res.status(500).json({ message, stack }));
    }));

authom.on('error', (req, res, data) => res.status(500).json(data));

module.exports = app => app.get('/auth/:service', authom.app) && app;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

const { Router } = __webpack_require__(3);
const Promise = __webpack_require__(2);
const serialize = __webpack_require__(68);
const { adminClientState, clientState } = __webpack_require__(35);
const { ensureAdmin } = __webpack_require__(12);

module.exports = app => {
  app.get('/admin*', ensureAdmin, (req, res, next) => {
    Promise.try(() => adminClientState())
      .then((clientState) => res.render('index', {
        appState: serialize(clientState, { isJSON: true }),
        context: 'admin',
      }))
      .catch(next);
  });

  app.get('*', (req, res, next) => {
    Promise.try(() => clientState(res.locals.user))
      .then((clientState) => res.render('index', {
        appState: serialize(clientState, { isJSON: true }),
        context: 'user',
      }))
      .catch(next);
  });

  return app;
};


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

const { Router } = __webpack_require__(3);

const { evaluation, evaluations } = __webpack_require__(29);

module.exports = (app) => {
  const router = Router();

  router.post('/:evaluationId', (req,res, next) => evaluation[req.body.action](req, res, next));
  router.get('/:evaluationId', (req,res, next) => evaluation.retrieve(req, res, next));
  router.post('/', (req, res, next) => evaluations.import(req, res, next));
  app.use('/evaluations', router);

  return app
};


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

const express = __webpack_require__(3);

const users = __webpack_require__(45);
const matrices = __webpack_require__(44);
const evaluations = __webpack_require__(42);
const actions = __webpack_require__(39);
const clientApp = __webpack_require__(41);
const auth = __webpack_require__(40);

const apiRoutes = [
  users,
  matrices,
  evaluations,
  actions,
];

const apiRouter = apiRoutes.reduce((app, route) => route(app), express.Router());

module.exports = basePath => app =>
  app.use(basePath, apiRouter)
  && auth(app)
  && clientApp(app);


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

const { Router } = __webpack_require__(3);

const { ensureAdmin } = __webpack_require__(12);
const { templates, skills } = __webpack_require__(30);

module.exports = (app) => {
  const router = Router();

  router.post('/templates', ensureAdmin, (req, res, next) => templates[req.body.action](req, res, next));
  router.get('/templates/:templateId', ensureAdmin, (req, res, next) => templates.retrieve(req, res, next));
  router.post('/skills', ensureAdmin, (req, res, next) => skills[req.body.action](req, res, next));
  router.get('/skills', ensureAdmin, (req, res, next) => skills.getAll(req, res, next));

  app.use('/matrices', router);

  return app
};


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

const { Router } = __webpack_require__(3);

const { ensureAdmin } = __webpack_require__(12);
const { users, user, evaluations } = __webpack_require__(31);

module.exports = (app) => {
  const router = Router();
  router.post('/', ensureAdmin, (req, res, next) => users[req.body.action](req, res, next));
  router.post('/:userId', (req, res, next) => user[req.body.action](req, res, next));
  router.post('/:userId/evaluations', ensureAdmin, (req, res, next) => evaluations[req.body.action](req, res, next));
  app.use('/users', router);
  return app
};


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

const axios = __webpack_require__(59);
const querystring = __webpack_require__(67);

const MAIL_DOMAIN = process.env.MAIL_DOMAIN;
const MAIL_API_KEY = process.env.MAIL_API_KEY;

const getData = (response) => response.data;

module.exports.sendMail = ({ recipients, subject, body }) => {
  // To NOT send emails (say as part of your test) don't set the API key
  if (!MAIL_DOMAIN || !MAIL_API_KEY) {
    return Promise.reject({ message: 'WAT? Missing credentials to send an email. Need MAIL_DOMAIN & MAIL_API_KEY' });
  }
  const options = {
    auth: {
      username: 'api',
      password: MAIL_API_KEY,
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  };

  const data = {
    from: `Skills Matrix <postmaster@${MAIL_DOMAIN}>`,
    to: [].concat(recipients),
    subject: subject,
    text: body,
  };
  return axios.post(`https://api.mailgun.net/v3/${MAIL_DOMAIN}/messages`, querystring.stringify(data), options)
    .then(getData, console.error);
};


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

const AWS = __webpack_require__(58);
const Promise = __webpack_require__(2);

const sesRegion = process.env.SES_REGION;

const getSES = function getSES() {
  const sesConfig = { region: sesRegion };
  AWS.config.update(sesConfig);

  return new AWS.SES();
};

module.exports.sendMail = ({ recipients, subject, body }) => {
  const data = {
    Source: 'Skills Matrix <skills.matrix@tes.com>',
    Destination: {
      ToAddresses: [].concat(recipients),
    },
    Message: {
      Subject: {
        Data: subject,
      },
      Body: {
        Text: {
          Data: body,
        },
      },
    },
  };

  return new Promise((resolve, reject) => getSES().sendEmail(data, (err) => err ? reject(err) : resolve()));
};


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

const request = __webpack_require__(6);
const Promise = __webpack_require__(2);
const { expect } = __webpack_require__(9);

const app = __webpack_require__(5);
const { prepopulateUsers, users, clearDb, insertAction, assignMentor } = __webpack_require__(8);
const { sign, cookieName } = __webpack_require__(1);
const actions = __webpack_require__(51);

const prefix = '/skillz';

let normalUserOneToken, normalUserTwoToken;
let normalUserOneId, normalUserTwoId;

describe('actions', () => {

  beforeEach(() =>
    clearDb()
      .then(() => prepopulateUsers())
      .then(() =>
        Promise.all([
            users.findOne({ email: 'user@magic.com' }),
            users.findOne({ email: 'user@dragon-riders.com' })
          ])
          .then(([normalUserOne, normalUserTwo]) => {
            normalUserOneToken = sign({ username: normalUserOne.username, id: normalUserOne._id });
            normalUserTwoToken = sign({ username: normalUserTwo.username, id: normalUserTwo._id });
            normalUserOneId = normalUserOne._id.toString();
            normalUserTwoId = normalUserTwo._id.toString();
          })));

  describe('GET /users/:userId/actions', () => {
    it('should return a list of all the user`s actions', () =>
      Promise.map(actions, insertAction(normalUserOneId))
        .then(() =>
          request(app)
            .get(`${prefix}/users/${normalUserOneId}/actions`)
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(200)
        )
        .then(({ body }) => {
          // @charlie - once you know what the viewmodel should look like, update this test
          expect(body.length).to.equal(actions.length);
        }));

    it('allows a mentor to view the actions of their mentee', () =>
      Promise.map(actions, insertAction(normalUserOneId))
        .then(() => assignMentor(normalUserOneId, normalUserTwoId))
        .then(() =>
          request(app)
            .get(`${prefix}/users/${normalUserOneId}/actions`)
            .set('Cookie', `${cookieName}=${normalUserTwoToken}`)
            .expect(200)
        )
        .then(({ body }) => {
          expect(body.length).to.equal(actions.length);
        }));

    it('only allows a user and their mentor to view actions', () =>
      Promise.map(actions, insertAction(normalUserOneId))
        .then(() =>
          request(app)
            .get(`${prefix}/users/${normalUserOneId}/actions`)
            .set('Cookie', `${cookieName}=${normalUserTwoToken}`)
            .expect(403)
        ));

    it('should filter based on evaluation Id', () =>
      Promise.map(actions, insertAction(normalUserOneId))
        .then(() =>
          request(app)
            .get(`${prefix}/users/${normalUserOneId}/actions?evaluationId=eval_1`)
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(200)
        )
        .then(({ body }) => {
          expect(body.length).to.equal(1);
        }));

    it('should filter based on type', () =>
      Promise.map(actions, insertAction(normalUserOneId))
        .then(() =>
          request(app)
            .get(`${prefix}/users/${normalUserOneId}/actions?type=OBJECTIVE`)
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(200)
        )
        .then(({ body }) => {
          expect(body.length).to.equal(1);
        }));
  });
});



/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

const request = __webpack_require__(6);

const app = __webpack_require__(5);

it('should redirect to github', () =>
  request(app)
    .get('/auth/github')
    .expect(302));


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

const request = __webpack_require__(6);
const { expect } = __webpack_require__(9);

const app = __webpack_require__(5);
const { prepopulateUsers, users, assignMentor, evaluations, insertTemplate, clearDb, insertSkill, insertEvaluation, getEvaluation, getAllActions } = __webpack_require__(8);
const { sign, cookieName } = __webpack_require__(1);
const { STATUS } = __webpack_require__(17);
const { NEW, SELF_EVALUATION_COMPLETE, MENTOR_REVIEW_COMPLETE } = STATUS;
const templateData = __webpack_require__(14);
const skills = __webpack_require__(13);
const [evaluation] = __webpack_require__(19);

const prefix = '/skillz';

let adminToken, normalUserOneToken, normalUserTwoToken;
let adminUserId, normalUserOneId, normalUserTwoId;

let evaluationId;

describe('evaluations', () => {

  beforeEach(() =>
    clearDb()
      .then(() => prepopulateUsers())
      .then(() => insertTemplate(templateData[0]))
      .then(() => skills.map(insertSkill))
      .then(() =>
        Promise.all([
          users.findOne({ email: 'dmorgantini@gmail.com' }),
          users.findOne({ email: 'user@magic.com' }),
          users.findOne({ email: 'user@dragon-riders.com' })
        ])
          .then(([adminUser, normalUserOne, normalUserTwo]) => {
            normalUserOneToken = sign({ username: normalUserOne.username, id: normalUserOne._id });
            normalUserTwoToken = sign({ username: normalUserTwo.username, id: normalUserTwo._id });
            adminToken = sign({ username: adminUser.username, id: adminUser._id });
            normalUserOneId = normalUserOne._id;
            normalUserTwoId = normalUserTwo._id;
            adminUserId = adminUser._id;
          })));

  describe('GET /evaluation/:evaluationId', () => {
    it('allows a user to retrieve their evaluation', () =>
      insertEvaluation(evaluation, normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() =>
          request(app)
            .get(`${prefix}/evaluations/${evaluationId}`)
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(200)
        )
        .then(({ body }) => {
          expect(body.subject.id).to.equal(String(normalUserOneId));
          expect(body.template.name).to.equal('Node JS Dev');
          expect(body.skillGroups[1]).to.not.be.undefined;
          expect(body.skills[1]).to.not.be.undefined;
          expect(body.view).to.equal('SUBJECT');
        }));

    it('allows a mentor to view the evaluation of their mentee', () =>
      insertEvaluation(evaluation, normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() => assignMentor(normalUserOneId, normalUserTwoId))
        .then(() =>
          request(app)
            .get(`${prefix}/evaluations/${evaluationId}`)
            .set('Cookie', `${cookieName}=${normalUserTwoToken}`)
            .expect(200)
            .then(({ body }) => {
              expect(body.subject.id).to.equal(String(normalUserOneId));
              expect(body.template.name).to.equal('Node JS Dev');
              expect(body.skillGroups[1]).to.not.be.undefined;
              expect(body.skills[1]).to.not.be.undefined;
              expect(body.view).to.equal('MENTOR');
            })));

    it('allows an admin user to view all evaluations', () =>
      insertEvaluation(evaluation, normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() =>
          request(app)
            .get(`${prefix}/evaluations/${evaluationId}`)
            .set('Cookie', `${cookieName}=${adminToken}`)
            .expect(200)
            .then(({ body }) => {
              expect(body.subject.id).to.equal(String(normalUserOneId));
              expect(body.template.name).to.equal('Node JS Dev');
              expect(body.skillGroups[1]).to.not.be.undefined;
              expect(body.skills[1]).to.not.be.undefined;
              expect(body.view).to.equal('ADMIN');
            })));

    it('sets evaluation view to subject if user is subject and admin', () =>
      insertEvaluation(evaluation, adminUserId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() =>
          request(app)
            .get(`${prefix}/evaluations/${evaluationId}`)
            .set('Cookie', `${cookieName}=${adminToken}`)
            .expect(200)
            .then(({ body }) => {
              expect(body.view).to.equal('SUBJECT');
            })));

    it('sets evaluation view to mentor if user is a mentor and they are an admin', () =>
      insertEvaluation(evaluation, normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() => assignMentor(normalUserOneId, adminUserId))
        .then(() =>
          request(app)
            .get(`${prefix}/evaluations/${evaluationId}`)
            .set('Cookie', `${cookieName}=${adminToken}`)
            .expect(200)
            .then(({ body }) => {
              expect(body.view).to.equal('MENTOR');
            })));

    it(`prevents a user that is not the subject, the subjects mentor, nor an admin user, from viewing an evaluation`, () =>
      insertEvaluation(evaluation, normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() =>
          request(app)
            .get(`${prefix}/evaluations/${evaluationId}`)
            .set('Cookie', `${cookieName}=${normalUserTwoToken}`)
            .expect(403)));

    const errorCases = [
      () => ({
        desc: 'no evaluation',
        token: normalUserOneToken,
        evaluationId: 'noMatchingId',
        expect: 404,
      }),
    ];

    errorCases.forEach((test) =>
      it(`handles error case:${test().desc}`, () =>
        request(app)
          .get(`${prefix}/evaluations/${test().evaluationId}`)
          .set('Cookie', `${cookieName}=${test().token}`)
          .expect(test().expect)))
  });

  describe('POST /evaluations/:evaluationId { action: subjectUpdateSkillStatus }', () => {
    it('allows a user to update the status of a skill for a new evaluation', () =>
      insertEvaluation(evaluation, normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({
              action: 'subjectUpdateSkillStatus',
              skillGroupId: 0,
              skillId: 1,
              status: 'ATTAINED'
            })
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(204)
        )
        .then(() => getEvaluation(evaluationId))
        .then(({ skills }) => {
          expect(skills[0].status).to.deep.equal({ previous: null, current: 'ATTAINED' });
        }));

    it('adds action when a skill is set to FEEDBACK', () =>
      insertEvaluation(evaluation, normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId.toString();
        })
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({
              action: 'subjectUpdateSkillStatus',
              skillGroupId: 0,
              skillId: 1,
              status: 'FEEDBACK'
            })
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(204)
        )
        .then(() => getAllActions())
        .then(([action]) => {
          expect(action).to.not.be.undefined;
          expect(action.type).to.equal('FEEDBACK');
          expect(action.evaluation.id).to.equal(evaluationId);
          expect(action.skill.id).to.equal(1);
        }));

    it('adds action when a skill is set to OBJECTIVE', () =>
      insertEvaluation(evaluation, normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId.toString();
        })
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({
              action: 'subjectUpdateSkillStatus',
              skillGroupId: 0,
              skillId: 1,
              status: 'OBJECTIVE'
            })
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(204)
        )
        .then(() => getAllActions())
        .then(([action]) => {
          expect(action).to.not.be.undefined;
          expect(action.type).to.equal('OBJECTIVE');
          expect(action.evaluation.id).to.equal(evaluationId);
          expect(action.skill.id).to.equal(1);
        }));

    it('removes action when a skill was previously FEEDBACK', () =>
      insertEvaluation(evaluation, normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId.toString();
        })
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({
              action: 'subjectUpdateSkillStatus',
              skillGroupId: 0,
              skillId: 1,
              status: 'FEEDBACK'
            })
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(204)
        )
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({
              action: 'subjectUpdateSkillStatus',
              skillGroupId: 0,
              skillId: 1,
              status: 'ATTAINED'
            })
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(204)
        )
        .then(() => getAllActions())
        .then(([action]) => {
          expect(action).to.be.undefined;
        }));

    it('prevents updates by the subject of the evaluation if they have completed their self-evaluation', () =>
      insertEvaluation(Object.assign({}, evaluation, { status: SELF_EVALUATION_COMPLETE }), normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({
              action: 'subjectUpdateSkillStatus',
              skillGroupId: 0,
              skillId: 1,
              status: 'ATTAINED'
            })
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(403)));

    it('prevents updates by the subject of an evaluation if the status is unknown', () =>
      insertEvaluation(Object.assign({}, evaluation, { status: 'FOO_BAR' }), normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({
              action: 'subjectUpdateSkillStatus',
              skillGroupId: 0,
              skillId: 1,
              status: 'ATTAINED'
            })
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(403)));

    it('prevents updates by the subject of the evaluation if the evaluation has been reviewed by their mentor', () =>
      insertEvaluation(Object.assign({}, evaluation, { status: MENTOR_REVIEW_COMPLETE }), normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({
              action: 'subjectUpdateSkillStatus',
              skillGroupId: 0,
              skillId: 1,
              status: 'ATTAINED'
            })
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(403)));

    it('prevents a user that is not the subject, from updating a skill', () =>
      insertEvaluation(evaluation, normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({
              action: 'subjectUpdateSkillStatus',
              skillGroupId: 0,
              skillId: 1,
              status: 'ATTAINED'
            })
            .set('Cookie', `${cookieName}=${normalUserTwoToken}`)
            .expect(403)));

    it('returns not found if an attempt is made to update an evaluation that does not exist', () =>
      request(app)
        .post(`${prefix}/evaluations/noMatchingId`)
        .send({
          action: 'subjectUpdateSkillStatus',
          skillGroupId: 0,
          skillId: 1,
          status: 'ATTAINED'
        })
        .set('Cookie', `${cookieName}=${normalUserOneToken}`)
        .expect(404));
  });

  describe('POST /evaluations/:evaluationId { action: mentorUpdateSkillStatus }', () => {

    it('allows a mentor to update a skill for their mentee if they have already self-evaluated', () =>
      insertEvaluation(Object.assign({}, evaluation, { status: SELF_EVALUATION_COMPLETE }), normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() => assignMentor(normalUserOneId, normalUserTwoId))
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({
              action: 'mentorUpdateSkillStatus',
              skillGroupId: 0,
              skillId: 1,
              status: 'ATTAINED'
            })
            .set('Cookie', `${cookieName}=${normalUserTwoToken}`)
            .expect(204)
        )
        .then(() => getEvaluation(evaluationId))
        .then(({ skills }) => {
          expect(skills[0].status).to.deep.equal({ previous: null, current: 'ATTAINED' });
        })
    );

    it('adds action when a skill is set to FEEDBACK', () =>
      insertEvaluation(Object.assign({}, evaluation, { status: SELF_EVALUATION_COMPLETE }), normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId.toString();
        })
        .then(() => assignMentor(normalUserOneId, normalUserTwoId))
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({
              action: 'mentorUpdateSkillStatus',
              skillGroupId: 0,
              skillId: 1,
              status: 'FEEDBACK'
            })
            .set('Cookie', `${cookieName}=${normalUserTwoToken}`)
            .expect(204)
        )
        .then(() => getAllActions())
        .then(([action]) => {
          expect(action).to.not.be.undefined;
          expect(action.type).to.equal('FEEDBACK');
          expect(action.evaluation.id).to.equal(evaluationId);
          expect(action.skill.id).to.equal(1);
        }));


    it('prevents updates by a mentor if the status of an evaluation is unknown', () =>
      insertEvaluation(Object.assign({}, evaluation, { status: 'FOO_BAR' }), normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() => assignMentor(normalUserOneId, normalUserTwoId))
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({
              action: 'mentorUpdateSkillStatus',
              skillGroupId: 0,
              skillId: 1,
              status: 'ATTAINED'
            })
            .set('Cookie', `${cookieName}=${normalUserTwoToken}`)
            .expect(403)));


    it('prevents updates by a mentor if they have already completed their review of an evaluation', () =>
      insertEvaluation(Object.assign({}, evaluation, { status: MENTOR_REVIEW_COMPLETE }), normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() => assignMentor(normalUserOneId, normalUserTwoId))
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({
              action: 'mentorUpdateSkillStatus',
              skillGroupId: 0,
              skillId: 1,
              status: 'ATTAINED'
            })
            .set('Cookie', `${cookieName}=${normalUserTwoToken}`)
            .expect(403)));

    it('prevents updates by a mentor if the evaluation has not been completed by their mentee', () =>
      insertEvaluation(Object.assign({}, evaluation, { status: NEW }), normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() => assignMentor(normalUserOneId, normalUserTwoId))
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({
              action: 'mentorUpdateSkillStatus',
              skillGroupId: 0,
              skillId: 1,
              status: 'ATTAINED'
            })
            .set('Cookie', `${cookieName}=${normalUserTwoToken}`)
            .expect(403)));

    it('prevents a user that is not the subject, nor the mentor of the subject, from updating a skill', () =>
      insertEvaluation(evaluation, normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({
              action: 'mentorUpdateSkillStatus',
              skillGroupId: 0,
              skillId: 1,
              status: 'ATTAINED'
            })
            .set('Cookie', `${cookieName}=${normalUserTwoToken}`)
            .expect(403)));

    it('returns not found if an attempt is made to update an evaluation that does not exist', () =>
      request(app)
        .post(`${prefix}/evaluations/noMatchingId`)
        .send({
          action: 'mentorUpdateSkillStatus',
          skillGroupId: 0,
          skillId: 1,
          status: 'ATTAINED'
        })
        .set('Cookie', `${cookieName}=${normalUserOneToken}`)
        .expect(404));
  });

  describe('POST /evaluations/:evaluationId { action: adminUpdateSkillStatus }', () => {

    it('allows an admin user to update a skill for any evaluation', () =>
      insertEvaluation(Object.assign({}, evaluation, { status: NEW }), normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({
              action: 'adminUpdateSkillStatus',
              skillGroupId: 0,
              skillId: 1,
              status: 'ATTAINED'
            })
            .set('Cookie', `${cookieName}=${adminToken}`)
            .expect(204)
        )
        .then(() => getEvaluation(evaluationId))
        .then(({ skills }) => {
          expect(skills[0].status).to.deep.equal({ previous: null, current: 'ATTAINED' });
        })
    );

    it('prevents users from updating the status of a skill via the admin handler if they are not an admin user', () =>
      insertEvaluation(Object.assign({}, evaluation, { status: NEW }), normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({
              action: 'adminUpdateSkillStatus',
              skillGroupId: 0,
              skillId: 1,
              status: 'ATTAINED'
            })
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(403)
        )
    );

    it('returns not found if an attempt is made to update an evaluation that does not exist', () =>
      request(app)
        .post(`${prefix}/evaluations/noMatchingId`)
        .send({
          action: 'mentorUpdateSkillStatus',
          skillGroupId: 0,
          skillId: 1,
          status: 'ATTAINED'
        })
        .set('Cookie', `${cookieName}=${adminToken}`)
        .expect(404));

    it('prevents a user that is not logged in from updating the status of a skill', () =>
      insertEvaluation(evaluation, normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({
              action: 'adminUpdateSkillStatus',
              skillGroupId: 0,
              skillId: 1,
              status: 'ATTAINED'
            })
            .expect(401)));

    it('returns bad request if attempt is made to update status of a skill that does not exist', () =>
      insertEvaluation(Object.assign({}, evaluation, { status: NEW }), normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({
              action: 'adminUpdateSkillStatus',
              skillGroupId: 0,
              skillId: 1111111,
              status: 'ATTAINED'
            })
            .set('Cookie', `${cookieName}=${adminToken}`)
            .expect(400)
        )
    );
  });

  describe('POST /evaluations/:evaluationId { action: complete }', () => {
    it('allows a user to complete their own evaluation when it is new', () =>
      insertEvaluation(evaluation, normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() => assignMentor(normalUserOneId, normalUserTwoId))
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({ action: 'complete' })
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(200)
            .then(({ body }) => {
              expect(body).to.deep.equal({ status: SELF_EVALUATION_COMPLETE })
            })
            .then(() => evaluations.findOne({ _id: evaluationId }))
            .then((completedApplication) => {
              expect(completedApplication.status).to.equal(SELF_EVALUATION_COMPLETE);
            })
        ));

    it('allows a mentor to complete a review of an evaluation for their mentee', () =>
      insertEvaluation(Object.assign({}, evaluation, { status: SELF_EVALUATION_COMPLETE }), normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() => assignMentor(normalUserOneId, normalUserTwoId))
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({ action: 'complete' })
            .set('Cookie', `${cookieName}=${normalUserTwoToken}`)
            .expect(200))
        .then(({ body }) => {
          expect(body).to.deep.equal({ status: MENTOR_REVIEW_COMPLETE })
        })
        .then(() => evaluations.findOne({ _id: evaluationId }))
        .then((completedApplication) => {
          expect(completedApplication.status).to.equal(MENTOR_REVIEW_COMPLETE);
        }));

    it('prevents the subject of an evaluation from completing their evaluation if it is not new', () =>
      insertEvaluation(Object.assign({}, evaluation, { status: SELF_EVALUATION_COMPLETE }), normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({ action: 'complete' })
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(403)));

    it('prevents the subject of an evaluation from completing their evaluation if the status is unknown', () =>
      insertEvaluation(Object.assign({}, evaluation, { status: 'FOO_BAR' }), normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({ action: 'complete' })
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(403)));

    it('prevents a mentor from completing a review for an evaluation if the status is unknown', () =>
      insertEvaluation(Object.assign({}, evaluation, { status: 'FOO_BAR' }), normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() => assignMentor(normalUserOneId, normalUserTwoId))
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({ action: 'complete' })
            .set('Cookie', `${cookieName}=${normalUserTwoToken}`)
            .expect(403)));

    it('prevents the subject of an evaluation from completing their evaluation after a mentor review', () =>
      insertEvaluation(Object.assign({}, evaluation, { status: MENTOR_REVIEW_COMPLETE }), normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({ action: 'complete' })
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(403)));

    it('prevents a mentor from completing a review for an evaluation they have alraedy reviewed', () =>
      insertEvaluation(Object.assign({}, evaluation, { status: MENTOR_REVIEW_COMPLETE }), normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() => assignMentor(normalUserOneId, normalUserTwoId))
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({ action: 'complete' })
            .set('Cookie', `${cookieName}=${normalUserTwoToken}`)
            .expect(403)));

    it('prevents mentor from completing a review of an evaluation before their mentee has self-evaluated', () =>
      insertEvaluation(Object.assign({}, evaluation, { status: NEW }), normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() => assignMentor(normalUserOneId, normalUserTwoId))
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({ action: 'complete' })
            .set('Cookie', `${cookieName}=${normalUserTwoToken}`)
            .expect(403)));

    it('prevents a user that is not the subject of the evaluation, nor the subjects mentor, from completing an evaluation', () =>
      insertEvaluation(evaluation, normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId = insertedId
        })
        .then(() =>
          request(app)
            .post(`${prefix}/evaluations/${evaluationId}`)
            .send({ action: 'complete' })
            .set('Cookie', `${cookieName}=${normalUserTwoToken}`)
            .expect(403)));

    it('returns not found if a request is made to complete an evaluation that does not exist', () =>
      request(app)
        .post(`${prefix}/evaluations/noMatchingId`)
        .send({ action: 'complete' })
        .set('Cookie', `${cookieName}=${normalUserOneToken}`)
        .expect(404))
  })
});



/***/ }),
/* 51 */
/***/ (function(module, exports) {

module.exports = [
	{
		"type": "FEEDBACK",
		"user": {
			"name": "User Magic",
			"mentorId": null
		},
		"skill": {
			"id": 1,
			"name": "Dragon Feeding",
			"criteria": "Can successfully feed their dragon"
		},
		"evaluation": {
			"id": "eval_1",
			"createdDate": "new Date()"
		},
		"createdDate": "new Date()"
	},
	{
		"type": "FEEDBACK",
		"user": {
			"name": "User Magic",
			"mentorId": null
		},
		"skill": {
			"id": 1,
			"name": "Dragon Feeding",
			"criteria": "Can successfully feed their dragon"
		},
		"evaluation": {
			"id": "eval_2",
			"createdDate": "new Date()"
		},
		"createdDate": "new Date()"
	},
	{
		"type": "OBJECTIVE",
		"user": {
			"name": "User Magic",
			"mentorId": null
		},
		"skill": {
			"id": 1,
			"name": "Dragon Feeding",
			"criteria": "Can successfully feed their dragon"
		},
		"evaluation": {
			"id": "eval_2",
			"createdDate": "new Date()"
		},
		"createdDate": "new Date()"
	}
];

/***/ }),
/* 52 */
/***/ (function(module, exports) {

module.exports = [
	{
		"username": "dmorgantini",
		"email": "dmorgantini@gmail.com",
		"name": "David Morgantini"
	},
	{
		"username": "magic",
		"email": "user@magic.com",
		"name": "User Magic",
		"templateId": "eng-nodejs"
	},
	{
		"email": "user@dragon-riders.com",
		"username": "dragon-riders",
		"name": "User Dragon Rider"
	}
];

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

const request = __webpack_require__(6);
const { expect } = __webpack_require__(9);
const moment = __webpack_require__(25);

const app = __webpack_require__(5);
const { prepopulateUsers, users, evaluations, insertTemplate, assignTemplate, clearDb, insertSkill, insertEvaluation, assignMentor } = __webpack_require__(8);
const { sign, cookieName } = __webpack_require__(1);
const [template] = __webpack_require__(14);
const skills = __webpack_require__(13);
const [evaluation] = __webpack_require__(19);

const beforeNow = moment().subtract(1, 'days').toDate();
const now = moment().toDate();

let adminToken, normalUserOneToken, normalUserTwoToken;
let adminUserId, normalUserOneId, normalUserTwoId;

const getInitialState = (str) => JSON.parse(str.match(/REDUX_STATE=(.*)/)[0].substr(12));

describe('initial client state', () => {

  beforeEach(() =>
    clearDb()
      .then(() => prepopulateUsers())
      .then(() => insertTemplate(template))
      .then(() => skills.map(insertSkill))
      .then(() =>
        Promise.all([
            users.findOne({ email: 'dmorgantini@gmail.com' }),
            users.findOne({ email: 'user@magic.com' }),
            users.findOne({ email: 'user@dragon-riders.com' })
          ])
          .then(([adminUser, normalUserOne, normalUserTwo]) => {
            normalUserOneToken = sign({ username: normalUserOne.username, id: normalUserOne._id });
            normalUserTwoToken = sign({ username: normalUserTwo.username, id: normalUserTwo._id });
            adminToken = sign({ username: adminUser.username, id: adminUser._id });
            normalUserOneId = String(normalUserOne._id);
            normalUserTwoId = String(normalUserTwo._id);
            adminUserId = String(adminUser._id);
          })));

  describe('normal user', () => {
    it('returns HTML with a script tag containing initial state', () =>
      request(app)
        .get('/')
        .set('Cookie', `${cookieName}=${normalUserOneToken}`)
        .expect(200)
        .then((res) => {
          const expectedState = {
            user: {
              evaluations: [],
              menteeEvaluations: [],
              mentorDetails: null,
              template: {
                id: 'eng-nodejs',
                name: 'Node JS Dev',
              },
              userDetails: {
                email: 'user@magic.com',
                name: 'User Magic',
                id: normalUserOneId,
                templateId: 'eng-nodejs',
                username: 'magic'
              }
            },
          };

          expect(getInitialState(res.text)).to.deep.equal(expectedState);
        })
    );

    it('returns initial state with evaluations from newest to oldest', () => {
      let evaluationId_OLD;
      let evaluationId_NEW;

      return insertEvaluation(Object.assign({}, evaluation, { createdDate: beforeNow }), normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId_OLD = insertedId;
        })
        .then(() => insertEvaluation(Object.assign({}, evaluation, { createdDate: now }), normalUserOneId))
        .then(({ insertedId  }) => {
          evaluationId_NEW = insertedId;
        })
        .then(() =>
          request(app)
            .get('/')
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(200)
            .then((res) => {
              const [firstEvaluation, secondEvaluation] = getInitialState(res.text).user.evaluations;

              expect(firstEvaluation.id).to.equal(String(evaluationId_NEW));
              expect(firstEvaluation).to.have.property('createdDate');
              expect(firstEvaluation.status).to.equal('NEW');
              expect(firstEvaluation.templateName).to.equal('Node JS Dev');
              expect(firstEvaluation.evaluationUrl).to.equal(`/evaluations/${String(evaluationId_NEW)}`);
              expect(firstEvaluation.feedbackUrl).to.equal(`/user/${String(normalUserOneId)}/evaluations/${String(evaluationId_NEW)}/feedback`);
              expect(firstEvaluation.objectivesUrl).to.equal(`/user/${String(normalUserOneId)}/evaluations/${String(evaluationId_NEW)}/objectives`);
              expect(firstEvaluation.view).to.equal('SUBJECT');

              expect(secondEvaluation.id).to.equal(String(evaluationId_OLD));
            })
        )
    });

    it('returns initial state with mentee evaluations from newest to oldest', () => {
      let menteeEvaluationId_OLD;
      let menteeEvaluationId_NEW;

      return assignMentor(normalUserTwoId, normalUserOneId)
        .then(() => insertEvaluation(Object.assign({}, evaluation, { createdDate: beforeNow }), normalUserTwoId))
        .then(({ insertedId }) => {
          menteeEvaluationId_OLD = insertedId;
        })
        .then(() => insertEvaluation(Object.assign({}, evaluation, { createdDate: now }), normalUserTwoId))
        .then(({ insertedId  }) => {
          menteeEvaluationId_NEW = insertedId;
        })
        .then(() => request(app)
          .get('/')
          .set('Cookie', `${cookieName}=${normalUserOneToken}`)
          .expect(200)
          .then((res) => {
            const [mentee] = getInitialState(res.text).user.menteeEvaluations;
            const [firstEvaluation, secondEvaluation] = mentee.evaluations;

            expect(mentee.name).to.equal('User Dragon Rider');

            expect(firstEvaluation.id).to.equal(String(menteeEvaluationId_NEW));
            expect(firstEvaluation).to.have.property('createdDate');
            expect(firstEvaluation.status).to.equal('NEW');
            expect(firstEvaluation.templateName).to.equal('Node JS Dev');
            expect(firstEvaluation.evaluationUrl).to.equal(`/evaluations/${String(menteeEvaluationId_NEW)}`);
            expect(firstEvaluation.feedbackUrl).to.equal(`/user/${String(normalUserTwoId)}/evaluations/${String(menteeEvaluationId_NEW)}/feedback`);
            expect(firstEvaluation.objectivesUrl).to.equal(`/user/${String(normalUserTwoId)}/evaluations/${String(menteeEvaluationId_NEW)}/objectives`);
            expect(firstEvaluation.view).to.equal('MENTOR');

            expect(secondEvaluation.id).to.equal(String(menteeEvaluationId_OLD));
          })
        )
    });

    it('returns initial state with mentor', () =>
      assignMentor(normalUserOneId, adminUserId)
        .then(({ insertedId: evaluationId }) =>
          request(app)
            .get('/')
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(200)
            .then((res) => {
              const expectedMentor = {
                email: 'dmorgantini@gmail.com',
                name: 'David Morgantini',
                username: 'dmorgantini',
                id: adminUserId,
              };

              expect(getInitialState(res.text).user.mentorDetails).to.deep.equal(expectedMentor);
            })
        )
    );

    it('returns initial state with template', () =>
      assignTemplate(normalUserOneId, template.id)
        .then(() =>
          request(app)
            .get('/')
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(200)
            .then((res) => {
              const expectedTemplate = {
                id: 'eng-nodejs',
                name: 'Node JS Dev'
              };

              expect(getInitialState(res.text).user.template).to.deep.equal(expectedTemplate);
            })
        )
    );

    it('returns initial state with user', () =>
      assignMentor(normalUserOneId, adminUserId)
        .then(() =>
          request(app)
            .get('/')
            .set('Cookie', `${cookieName}=${normalUserOneToken}`)
            .expect(200)
            .then((res) => {
              const expectedUser = {
                email: 'user@magic.com',
                id: normalUserOneId,
                mentorId: adminUserId,
                name: 'User Magic',
                templateId: 'eng-nodejs',
                username: 'magic'
              };

              expect(getInitialState(res.text).user.userDetails).to.deep.equal(expectedUser);
            })
        )
    );
  });

  describe('admin user', () => {
    it('returns HTML with a script tag containing initial state', () =>
      request(app)
        .get('/admin')
        .set('Cookie', `${cookieName}=${adminToken}`)
        .expect(200)
        .then((res) => {
          expect(getInitialState(res.text)).to.have.property('matrices');
          expect(getInitialState(res.text)).to.have.property('users');
        })
    );

    it('returns initial state with all templates', () =>
      request(app)
        .get('/admin')
        .set('Cookie', `${cookieName}=${adminToken}`)
        .expect(200)
        .then((res) => {
          const expectedTemplates = [
            {
              id: 'eng-nodejs',
              name: 'Node JS Dev',
            }
          ];

          expect(getInitialState(res.text).matrices.templates).to.deep.equal(expectedTemplates);
        })
    );

    it('returns initial state with all users', () =>
      request(app)
        .get('/admin')
        .set('Cookie', `${cookieName}=${adminToken}`)
        .expect(200)
        .then((res) => {
          const expectedUsers = [
            {
              email: 'dmorgantini@gmail.com',
              id: adminUserId,
              name: 'David Morgantini',
              username: 'dmorgantini',
              evaluations: []
            },
            {
              email: 'user@magic.com',
              id: normalUserOneId,
              name: 'User Magic',
              username: 'magic',
              templateId: 'eng-nodejs',
              evaluations: []
            },
            {
              email: 'user@dragon-riders.com',
              id: normalUserTwoId,
              name: 'User Dragon Rider',
              username: 'dragon-riders',
              evaluations: []
            }
          ];

          expect(getInitialState(res.text).users.users).to.deep.equal(expectedUsers);
        })
    );

    it('returns initial state with all users and their evaluations (newest to oldest)', () => {
      let evaluationId_OLD;
      let evaluationId_NEW;

      return insertEvaluation(Object.assign({}, evaluation, { createdDate: beforeNow }), normalUserOneId)
        .then(({ insertedId }) => {
          evaluationId_OLD = String(insertedId);
        })
        .then(() => insertEvaluation(Object.assign({}, evaluation, { createdDate: now }), normalUserOneId))
        .then(({ insertedId  }) => {
          evaluationId_NEW = String(insertedId);
        })
        .then(() =>
          request(app)
            .get('/admin')
            .set('Cookie', `${cookieName}=${adminToken}`)
            .expect(200)
            .then((res) => {
              const [userOne, userTwo, userThree] = getInitialState(res.text).users.users;

              expect(userOne.evaluations).to.eql([]);
              expect(userThree.evaluations).to.eql([]);

              const [firstEvaluation, secondEvaluation] = userTwo.evaluations;

              expect(firstEvaluation.createdDate).to.equal(now.toISOString());
              expect(firstEvaluation.evaluationUrl).to.equal(`/evaluations/${evaluationId_NEW}`);
              expect(firstEvaluation.feedbackUrl).to.equal(`/user/${String(normalUserOneId)}/evaluations/${evaluationId_NEW}/feedback`);
              expect(firstEvaluation.objectivesUrl).to.equal(`/user/${String(normalUserOneId)}/evaluations/${evaluationId_NEW}/objectives`);
              expect(firstEvaluation.id).to.equal(evaluationId_NEW);
              expect(firstEvaluation.status).to.equal('NEW');
              expect(firstEvaluation.templateName).to.equal('Node JS Dev');
              expect(firstEvaluation.view).to.equal('ADMIN');

              expect(secondEvaluation.createdDate).to.equal(beforeNow.toISOString());
              expect(secondEvaluation.evaluationUrl).to.equal(`/evaluations/${evaluationId_OLD}`);
              expect(secondEvaluation.feedbackUrl).to.equal(`/user/${String(normalUserOneId)}/evaluations/${evaluationId_OLD}/feedback`);
              expect(secondEvaluation.objectivesUrl).to.equal(`/user/${String(normalUserOneId)}/evaluations/${evaluationId_OLD}/objectives`);
              expect(secondEvaluation.id).to.equal(evaluationId_OLD);
              expect(secondEvaluation.status).to.equal('NEW');
              expect(secondEvaluation.templateName).to.equal('Node JS Dev');
              expect(secondEvaluation.view).to.equal('ADMIN');
            }));
    })
  });
});


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

const request = __webpack_require__(6);
const { expect } = __webpack_require__(9);
const Promise = __webpack_require__(2);

const app = __webpack_require__(5);
const { sign, cookieName } = __webpack_require__(1);
const { users, templates, skills, prepopulateUsers, insertTemplate, insertSkill, clearDb } = __webpack_require__(8);
const [sampleTemplate] = __webpack_require__(14);
const [sampleSkill] = __webpack_require__(13);
const allSkills = __webpack_require__(13);

const prefix = '/skillz/matrices';

let adminToken, normalUserToken;
let adminUserId, normalUserId;

describe('matrices', () => {
  beforeEach(() =>
    clearDb()
      .then(prepopulateUsers)
      .then(() =>
        Promise.all([users.findOne({ email: 'dmorgantini@gmail.com' }), users.findOne({ email: 'user@magic.com' })])
          .then(([adminUser, normalUser]) => {
            adminToken = sign({ username: adminUser.username, id: adminUser._id });
            normalUserToken = sign({ username: normalUser.username, id: normalUser._id });
            normalUserId = normalUser._id;
            adminUserId = adminUser._id;
          }))
  );

  describe('GET /matrices/template', () => {
    it('gets the template by id', () => {
      return insertTemplate(Object.assign({}, sampleTemplate))
        .then(() =>
          request(app)
            .get(`${prefix}/templates/${sampleTemplate.id}`)
            .set('Cookie', `${cookieName}=${adminToken}`)
            .expect(200)
            .then(({ body }) => {
              expect(body.name).to.equal('Node JS Dev');
              expect(body.skillGroups[0].category).to.equal('Dragon Flight');
            }));
    });

    const errorCases =
      [
        () => ({
          desc: 'not authorized',
          token: normalUserToken,
          id: sampleTemplate.id,
          expect: 403,
        }),
        () => ({
          desc: 'no template',
          token: adminToken,
          id: 'lolz-lolz',
          expect: 404,
        }),
      ];

    errorCases.forEach((test) =>
      it(`should handle error cases '${test().desc}'`, () =>
        request(app)
          .get(`${prefix}/templates/${test().id}`)
          .set('Cookie', `${cookieName}=${test().token}`)
          .expect(test().expect)));
  });

  describe('POST /matrices/templates', () => {
    it('permits saving of new templates by admin users', () =>
      request(app)
        .post(`${prefix}/templates`)
        .send({ action: 'save', template: JSON.stringify(sampleTemplate) })
        .set('Cookie', `${cookieName}=${adminToken}`)
        .expect(201)
        .then((res) => templates.findOne({ id: 'eng-nodejs' }))
        .then(newTemplate => {
          expect(newTemplate.name).to.equal('Node JS Dev');
          expect(newTemplate.skillGroups[0].category).to.equal('Dragon Flight');
        }));

    it('updates an existing template with the same id', () =>
      insertTemplate(Object.assign({}, sampleTemplate))
        .then(() =>
          request(app)
            .post(`${prefix}/templates`)
            .send({
              action: 'save',
              template: JSON.stringify(Object.assign({}, sampleTemplate, { name: 'new name', skillGroups: [] }))
            })
            .set('Cookie', `${cookieName}=${adminToken}`)
            .expect(201))
        .then(res => templates.findOne({ id: 'eng-nodejs' }))
        .then(updatedTemplate => {
          expect(updatedTemplate.name).to.deep.equal('new name');
          expect(updatedTemplate.skillGroups.length).to.equal(0);
        }));

    const errorCases =
      [
        () => ({
          desc: 'not authorized',
          token: normalUserToken,
          body: { action: 'create', template: {} },
          expect: 403,
        }),
        () => ({
          desc: 'bad action',
          token: adminToken,
          body: { action: 'foo', template: {} },
          expect: 400,
        }),
      ];

    errorCases.forEach((test) =>
      it(`should handle error cases '${test().desc}'`, () =>
        request(app)
          .post(`${prefix}/templates`)
          .send(test().body)
          .set('Cookie', `${cookieName}=${test().token}`)
          .expect(test().expect)));
  });

  describe('GET matrices/skills', () => {
    it('gets all the skills', () =>
      Promise.map(allSkills, insertSkill)
        .then(() =>
          request(app)
            .get(`${prefix}/skills`)
            .set('Cookie', `${cookieName}=${adminToken}`)
            .expect(200)
            .then((res) => {
              // dear future me, I'm sorry.
              expect(res.body[1].name).to.equal(allSkills[0].name);
              expect(res.body[2].name).to.equal(allSkills[1].name);
              expect(res.body[6].name).to.equal(allSkills[5].name);
            })));
  });

  describe('POST matrices/skills', () => {
    it('permits saving of a new skill by admin users', () =>
      request(app)
        .post(`${prefix}/skills`)
        .send({
          action: 'save',
          skill: JSON.stringify(sampleSkill)
        })
        .set('Cookie', `${cookieName}=${adminToken}`)
        .expect(201)
        .then(res => skills.findOne({ id: 1 }))
        .then(newSkill => {
          expect(newSkill.id).to.equal(1);
          expect(newSkill.name).to.equal('Dragon Feeding');
        })
    );

    it('permits saving of a list of new skills by admin users', () =>
      request(app)
        .post(`${prefix}/skills`)
        .send({
          action: 'save',
          skill: JSON.stringify(allSkills)
        })
        .set('Cookie', `${cookieName}=${adminToken}`)
        .expect(201)
        .then(res => skills.find({}))
        .then(savedSkills => savedSkills.toArray())
        .then((savedSkills) => {
          expect(savedSkills.length).to.equal(allSkills.length);
        })
    );

    it('updates an existing skill with the same id', () =>
      insertSkill(Object.assign({}, sampleSkill))
        .then(() =>
          request(app)
            .post(`${prefix}/skills`)
            .send({
              action: 'save',
              skill: JSON.stringify(Object.assign({}, sampleSkill, { name: 'new name', questions: [] }))
            })
            .set('Cookie', `${cookieName}=${adminToken}`)
            .expect(201))
        .then(res => skills.findOne({ id: 1 }))
        .then(updatedSkill => {
          expect(updatedSkill.id).to.equal(1);
          expect(updatedSkill.name).to.deep.equal('new name');
          expect(updatedSkill.questions.length).to.equal(0);
        }));

    const errorCases =
      [
        () => ({
          desc: 'not authorized',
          token: normalUserToken,
          body: { action: 'create', skill: {} },
          expect: 403,
        }),
        () => ({
          desc: 'bad action',
          token: adminToken,
          body: { action: 'foo', skill: {} },
          expect: 400,
        }),
      ];

    errorCases.forEach((test) =>
      it(`should handle error cases '${test().desc}'`, () =>
        request(app)
          .post(`${prefix}/skills`)
          .send(test().body)
          .set('Cookie', `${cookieName}=${test().token}`)
          .expect(test().expect)));
  });
});


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

const request = __webpack_require__(6);
const { expect } = __webpack_require__(9);
const { ObjectId } = __webpack_require__(10);

const app = __webpack_require__(5);
const { prepopulateUsers, users, templates, insertTemplate, clearDb } = __webpack_require__(8);
const [sampleTemplate] = __webpack_require__(14);
const { sign, cookieName } = __webpack_require__(1);

const prefix = '/skillz';

const templateId = 'eng-nodejs';

let adminToken, normalUserToken;
let adminUserId, normalUserId;

describe('users', () => {
  beforeEach(() =>
    clearDb()
      .then(prepopulateUsers)
      .then(() =>
        Promise.all([users.findOne({ email: 'dmorgantini@gmail.com' }), users.findOne({ email: 'user@magic.com' })])
          .then(([adminUser, normalUser]) => {
            adminToken = sign({ username: adminUser.username, id: adminUser._id });
            normalUserToken = sign({ username: normalUser.username, id: normalUser._id });
            normalUserId = normalUser._id;
            adminUserId = adminUser._id;
          })));

  describe('POST /users', () => {
    it('should let admin create users', () =>
      request(app)
        .post(`${prefix}/users`)
        .send({ username: 'newuser', email: 'newuser@user.com', name: 'new name', action: 'create' })
        .set('Cookie', `${cookieName}=${adminToken}`)
        .expect(201)
        .then((res) => users.findOne({ email: res.body.email }))
        .then((newUser) => {
          expect(newUser.email).to.equal('newuser@user.com');
          expect(newUser.name).to.equal('new name');
        }));

    [
      () => ({
        desc: 'not authorized',
        token: normalUserToken,
        body: { username: 'newuser', email: 'newuser@user.com', name: 'new name', action: 'create' },
        expect: 403,
      }),
      () => ({
        desc: 'conflict',
        token: adminToken,
        body: { username: 'magic', email: 'user@magic.com', name: 'new name', action: 'create' },
        expect: 409,
      }),
      () => ({
        desc: 'bad action',
        token: adminToken,
        body: { username: 'newuser', email: 'user@magic.com', name: 'new name', action: 'foo' },
        expect: 400,
      })
    ].forEach((test) =>
      it(`should handle error cases '${test().desc}'`, () =>
        request(app)
          .post(`${prefix}/users`)
          .send(test().body)
          .set('Cookie', `${cookieName}=${test().token}`)
          .expect(test().expect)));


  });

  describe('POST /users/:userId { action: selectMentor }', () => {
    it('should let admin select a mentor', () =>
      request(app)
        .post(`${prefix}/users/${normalUserId}`)
        .send({ mentorId: adminUserId, action: 'selectMentor' })
        .set('Cookie', `${cookieName}=${adminToken}`)
        .expect(200)
        .then((res) => users.findOne({ _id: new ObjectId(normalUserId) }))
        .then((updatedUser) => {
          expect(updatedUser.mentorId).to.equal(adminUserId.toString());
        }));

    [
      () => ({
        desc: 'not authorized',
        token: normalUserToken,
        body: { mentorId: adminUserId, action: 'selectMentor' },
        userId: normalUserId,
        expect: 403,
      }),
      () => ({
        desc: 'no user',
        token: adminToken,
        body: { mentorId: adminUserId, action: 'selectMentor' },
        userId: '58a237c185b8790720deb924',
        expect: 404,
      }),
      () => ({
        desc: 'bad action',
        token: adminToken,
        body: { mentorId: adminUserId, action: 'foo' },
        userId: normalUserId,
        expect: 400,
      }),
      () => ({
        desc: 'can not mentor themselves',
        token: adminToken,
        body: { mentorId: normalUserId, action: 'selectMentor' },
        userId: normalUserId,
        expect: 400,
      }),
    ].forEach((test) =>
      it(`should handle error cases '${test().desc}'`, () =>
        request(app)
          .post(`${prefix}/users/${test().userId}`)
          .send(test().body)
          .set('Cookie', `${cookieName}=${test().token}`)
          .expect(test().expect)));


  });

  describe('POST /users/:userId { action: selectTemplate }', () => {
    it('should let admin select a template for a user', () =>
      insertTemplate(sampleTemplate)
        .then(() =>
          request(app)
            .post(`${prefix}/users/${normalUserId}`)
            .send({ templateId, action: 'selectTemplate' })
            .set('Cookie', `${cookieName}=${adminToken}`)
            .expect(200))
        .then((res) => users.findOne({ _id: new ObjectId(normalUserId) }))
        .then((updatedUser) => {
          expect(updatedUser.templateId).to.equal(templateId);
        }));

    [
      () => ({
        desc: 'not authorized',
        token: normalUserToken,
        body: { templateId, action: 'selectTemplate' },
        userId: normalUserId,
        expect: 403,
      }),
      () => ({
        desc: 'no user',
        token: adminToken,
        body: { templateId, action: 'selectTemplate' },
        userId: '58a237c185b8790720deb924',
        expect: 404,
      }),
      () => ({
        desc: 'template not found',
        token: adminToken,
        body: { templateId: 'does-not-exist-lolz', action: 'selectTemplate' },
        userId: normalUserId,
        expect: 400,
      }),
    ].forEach((test) =>
      it(`should handle error cases '${test().desc}'`, () =>
        request(app)
          .post(`${prefix}/users/${test().userId}`)
          .send(test().body)
          .set('Cookie', `${cookieName}=${test().token}`)
          .expect(test().expect)));
  });
});


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

const request = __webpack_require__(6);
const { expect } = __webpack_require__(9);

const app = __webpack_require__(5);
const { prepopulateUsers, users, evaluations, insertTemplate, clearDb, insertSkill, insertEvaluation, assignMentor, getEvaluations } = __webpack_require__(8);
const { sign, cookieName } = __webpack_require__(1);
const templateData = __webpack_require__(14);
const skills = __webpack_require__(13);
const [evaluation, completedEvaluation] = __webpack_require__(19);

const prefix = '/skillz';
const templateId = 'eng-nodejs';

let adminToken, normalUserOneToken, normalUserTwoToken;
let adminUserId, normalUserOneId, normalUserTwoId;

describe('userEvaluations', () => {

  beforeEach(() =>
    clearDb()
      .then(() => prepopulateUsers())
      .then(() => insertTemplate(templateData[0]))
      .then(() => skills.map(insertSkill))
      .then(() =>
        Promise.all([
          users.findOne({ email: 'dmorgantini@gmail.com' }),
          users.findOne({ email: 'user@magic.com' }),
          users.findOne({ email: 'user@dragon-riders.com' })
        ])
          .then(([adminUser, normalUserOne, normalUserTwo]) => {
            normalUserOneToken = sign({ username: normalUserOne.username, id: normalUserOne._id });
            normalUserTwoToken = sign({ username: normalUserTwo.username, id: normalUserTwo._id });
            adminToken = sign({ username: adminUser.username, id: adminUser._id });
            normalUserOneId = normalUserOne._id;
            normalUserTwoId = normalUserTwo._id;
            adminUserId = adminUser._id;
          }))
      .then(() => assignMentor(normalUserOneId, normalUserTwoId)));

  describe('POST /users/:userId/evaluations', () => {
    it('allows admin user to create an evaluation for a user', () =>
      request(app)
        .post(`${prefix}/users/${normalUserOneId}/evaluations`)
        .send({ action: 'create' })
        .set('Cookie', `${cookieName}=${adminToken}`)
        .expect(201)
        .then(getEvaluations)
        .then((evaluationList) => {
          // see ./unit/evaluation-test.js for test to ensure evaluation is correctly generated
          expect(evaluationList.length).to.equal(1);
        }));

    it('takes previous evaluation into account when making new evaluation', () =>
      insertEvaluation(completedEvaluation, normalUserOneId)
        .then(() =>
          request(app)
            .post(`${prefix}/users/${normalUserOneId}/evaluations`)
            .send({ action: 'create' })
            .set('Cookie', `${cookieName}=${adminToken}`)
            .expect(201)
            .then(getEvaluations)
            .then(([firstEvaluation, secondEvaluation]) => {
              // see ./unit/evaluation-test.js for test to ensure evaluation is correctly generated
              expect(secondEvaluation).to.be.not.null;
              expect(secondEvaluation.skills[1].status).to.deep.equal({
                previous: 'FEEDBACK',
                current: null
              });
            })));

    const errorCases = [
      () => ({
        desc: 'not authorized',
        token: normalUserOneToken,
        body: { action: 'create' },
        userId: normalUserOneToken,
        expect: 403,
      }),
      () => ({
        desc: 'no user',
        token: adminToken,
        body: { action: 'create' },
        userId: '58a237c185b8790720deb924',
        expect: 404,
      }),
      () => ({
        desc: 'bad action',
        token: adminToken,
        body: { action: 'foo' },
        userId: normalUserOneToken,
        expect: 400,
      }),
      () => ({
        desc: 'no template selected for user',
        token: adminToken,
        body: { action: 'create' },
        userId: adminUserId,
        expect: 400,
      }),
    ];

    errorCases.forEach((test) =>
      it(`handles error case: ${test().desc}`, () =>
        request(app)
          .post(`${prefix}/users/${test().userId}/evaluations`)
          .send(test().body)
          .set('Cookie', `${cookieName}=${test().token}`)
          .expect(test().expect)));

  });
});


/***/ }),
/* 57 */
/***/ (function(module, exports) {

module.exports = require("authom");

/***/ }),
/* 58 */
/***/ (function(module, exports) {

module.exports = require("aws-sdk");

/***/ }),
/* 59 */
/***/ (function(module, exports) {

module.exports = require("axios");

/***/ }),
/* 60 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 61 */
/***/ (function(module, exports) {

module.exports = require("cookie-parser");

/***/ }),
/* 62 */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),
/* 63 */
/***/ (function(module, exports) {

module.exports = require("debug");

/***/ }),
/* 64 */
/***/ (function(module, exports) {

module.exports = require("express-handlebars");

/***/ }),
/* 65 */
/***/ (function(module, exports) {

module.exports = require("jsonwebtoken");

/***/ }),
/* 66 */
/***/ (function(module, exports) {

module.exports = require("morgan");

/***/ }),
/* 67 */
/***/ (function(module, exports) {

module.exports = require("querystring");

/***/ }),
/* 68 */
/***/ (function(module, exports) {

module.exports = require("serialize-javascript");

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {


    var testsContext = __webpack_require__(26);

    var runnable = testsContext.keys();

    runnable.forEach(testsContext);
    

/***/ })
/******/ ]);