const R = require('ramda');

const hydrateSkillsWithStaticData = skills =>
  ({ id: skillGroupId, level, category, skills: skillsInSkillGroup }) =>
    R.map(
      (skillUid) => {
        const { id, name, criteria, questions } = skills[skillUid];

        return ({
          skillUid,
          id,
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

const category = skillGroup => skillGroup.category;

module.exports = (skills, skillGroups, levels, categories) =>
  R.compose(
    R.flatten,
    R.map(hydrateSkillsWithStaticData(skills)),
    orderCategories(categories),
    R.map(sortSkillGroupsByInverseLevel(levels)),
    R.groupBy(category),
    R.values,
  )(skillGroups);
