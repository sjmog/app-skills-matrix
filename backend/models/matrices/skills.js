/* eslint-disable no-prototype-builtins */
const R = require('ramda');

const skill = require('./skill');

const skills = (skillsArray) => {
  const skillsMap = skillsArray.reduce((acc, aSkill) => Object.assign({}, acc, { [aSkill.id]: skill(aSkill) }), {});
  const skillsToMap = {
    get: (target, name) => (target.hasOwnProperty(name) ? target[name] : skillsMap[name]),
  };

  const skillsFunctions = {
    get viewModel() {
      return R.map(s => s.evaluationData, skillsMap);
    },
  };

  return new Proxy(skillsFunctions, skillsToMap);
};

module.exports = skills;
