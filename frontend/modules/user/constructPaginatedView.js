const R = require('ramda');

const hydrateSkillsWithStaticData = skills =>
  ({ id: skillGroupId, level, category, skills: skillsInSkillGroup }) =>
    R.map(
      (skillId) => {
        const { name, criteria, questions } = skills[skillId];

        return ({
          skillId,
          name,
          criteria,
          questions,
          skillGroupId,
          level,
          category,
        });
      },
    )(skillsInSkillGroup);

const sortSkillGroupsByInverseLevel = levels =>
  (skillGroups) => {
    const indexOfLevel = (a, b) => {
      if (levels.indexOf(a.level) > levels.indexOf(b.level)) return -1;
      if (levels.indexOf(a.level) < levels.indexOf(b.level)) return 1;
      return 0;
    };

    return R.sort(indexOfLevel)(R.values(skillGroups));
  };

const orderCategories = categories =>
  obj => R.reduce((acc, curr) => [].concat(acc, obj[curr]), [])(categories);

module.exports = (evaluation) => {
  const skillGroups = R.path(['skillGroups'], evaluation);
  const skills = R.path(['skills'], evaluation);
  const levels = R.path(['template', 'levels'], evaluation);
  const categories = R.path(['template', 'categories'], evaluation);

  const category = skillGroup => skillGroup.category;

  return R.compose(
    R.flatten,
    R.map(hydrateSkillsWithStaticData(skills)),
    orderCategories(categories),
    R.map(sortSkillGroupsByInverseLevel(levels)),
    R.groupBy(category),
    R.values,
  )(skillGroups);
};
