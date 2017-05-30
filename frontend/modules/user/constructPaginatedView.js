const R = require('ramda');

const hydrateSkillsWithStaticData = (skills) =>
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
        })
      }
    )(skillsInSkillGroup);

const sortByLevel = (levels) =>
  (category) => {
    const indexOfLevel = (a, b) => levels.indexOf(a.level) > levels.indexOf(b.level);
    return R.sort(indexOfLevel)(R.values(category));
  };

const sortByCategoryOrder = (categories) =>
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
    sortByCategoryOrder(categories),
    R.map(sortByLevel(levels)),
    R.groupBy(category),
    R.values
  )(skillGroups);
};
