import * as React from 'react';
import { connect } from 'react-redux';

import { SKILL_STATUS, NEWLY_ATTAINED } from '../../../modules/user/skills';

type FiltersProps = {
    evaluationId: string,
    updateFilter: (evaluationId: string, filter: string, idsToFilter: string[]) => void,
    getMatrixSkillsStatusFilter: (evaluationId: string) => string[],
    currentFilter: string,
};

const Filters = ({ evaluationId, updateFilter, getMatrixSkillsStatusFilter, currentFilter }: FiltersProps) => {
  const updateFilterFor = skillStatus => updateFilter(evaluationId, skillStatus, getMatrixSkillsStatusFilter(skillStatus));
  const currentFilterClass = skillStatus => currentFilter === skillStatus ? 'skill--filters--selected' : '';

  return (
      <div>
        <h4>Filter by</h4>
        <p role="button" className={`${currentFilterClass(SKILL_STATUS.ATTAINED)} skill--filters skill--attained state--icon--ATTAINED`} onClick={() => updateFilterFor(SKILL_STATUS.ATTAINED)}>Attained</p>
        <p role="button" className={`${currentFilterClass(NEWLY_ATTAINED)} skill--filters skill--newly-attained state--icon--ATTAINED`} onClick={() => updateFilterFor(NEWLY_ATTAINED)}>Newly attained</p>
        <p role="button" className={`${currentFilterClass(SKILL_STATUS.OBJECTIVE)} skill--filters skill--objective state--icon--OBJECTIVE`} onClick={() => updateFilterFor(SKILL_STATUS.OBJECTIVE)}>Objective</p>
        <p role="button" className={`${currentFilterClass(SKILL_STATUS.FEEDBACK)} skill--filters skill--feedback state--icon--FEEDBACK`} onClick={() => updateFilterFor(SKILL_STATUS.FEEDBACK)}>Feedback</p>
        <p role="button" className={`${currentFilterClass(SKILL_STATUS.NOT_ATTAINED)} skill--filters skill--not-attained state--icon--NOT_ATTAINED`} onClick={() => updateFilterFor(SKILL_STATUS.NOT_ATTAINED)}>Not attained</p>
      </div>
  );
};

export default Filters;
