import R from 'ramda';

import { actions } from './../evaluation';
import { constants } from './../evaluations';

const getSkillsFromAppState = (appState, evaluationId) =>
  R.path(['entities', 'evaluations', 'entities', evaluationId, 'skills'], appState);

export default store => next => action => {
  if (action.type === constants.SKILL_STATUS_UPDATE_SUCCESS) {
    const skills = getSkillsFromAppState(store.getState(), action.payload.evaluationId);
    store.dispatch(actions.nextUnevaluatedSkill(skills));
  }

  next(action);
}