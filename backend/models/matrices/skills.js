const skill = require('./skill');

const skillsFunctions = {};

const skills = (skillsArray) => {
  const skillsMap = skillsArray.reduce((acc, aSkill) => Object.assign({}, acc, { [aSkill.id]: skill(aSkill) }), {});
  const skillsToMap = {
    get: (target, name) => target.hasOwnProperty(name) ? target[name] : skillsMap[name]
  };

  return new Proxy(skillsFunctions, skillsToMap);
};

module.exports = skills;
