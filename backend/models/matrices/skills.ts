import * as R from 'ramda';

import skill, { Skill } from './skill';

export default (skillsArray: UnhydratedTemplateSkill[]) => {
  const skillsMap = skillsArray.reduce((acc: { [id: number]: Skill }, aSkill) =>
      Object.assign({}, acc, { [aSkill.id]: skill(aSkill) }),
    {});
  const skillsToMap = {
    get: (target, name) => (target.hasOwnProperty(name) ? target[name] : skillsMap[name]),
  };

  const skillsFunctions = {
    viewModel() {
      return R.map(s => s.data(), skillsMap);
    },
  };

  return new Proxy(skillsFunctions, skillsToMap);
};
