/* eslint-disable no-prototype-builtins */
import R from 'ramda';

import skill from './skill';

export default (skillsArray) => {
  const skillsMap = skillsArray.reduce((acc, aSkill) => Object.assign({}, acc, { [aSkill.id]: skill(aSkill) }), {});
  const skillsToMap = {
    get: (target, name) => (target.hasOwnProperty(name) ? target[name] : skillsMap[name]),
  };

  const skillsFunctions = {
    viewModel() {
      return R.map(s => s.evaluationData(), skillsMap);
    },
  };

  return new Proxy(skillsFunctions, skillsToMap);
};
