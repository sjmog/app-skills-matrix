import axios from 'axios';
import { getData, handleError } from './index';

export default ({
  retrieveEvaluation(evaluationId): Promise<HydratedEvaluationViewModel> {
    return axios.get(`/skillz/evaluations/${evaluationId}`)
      .then(getData)
      .catch(handleError);
  },
  updateSkillStatus(evaluationId: string, skillId: string, status): Promise<any> {
    return axios.post(`/skillz/evaluations/${evaluationId}`, { action: 'updateSkillStatus', skillId, status })
      .catch(handleError);
  },
  evaluationComplete(evaluationId): Promise<EvaluationMetadataViewModel> {
    return axios.post(`/skillz/evaluations/${evaluationId}`, { action: 'complete' })
      .then(getData)
      .catch(handleError);
  },
  addNote(evaluationId, skillId, note): Promise<NoteViewModel> {
    return axios.post(`/skillz/evaluations/${evaluationId}`, { action: 'addNote', skillId, note })
      .then(getData)
      .catch(handleError);
  },
  deleteNote(evaluationId, skillId, noteId): Promise<any> {
    return axios.post(`/skillz/evaluations/${evaluationId}`, { action: 'deleteNote', skillId, noteId })
      .then(getData)
      .catch(handleError);
  },
  retrieveTasks(userId): Promise<TaskViewModel[]> {
    return axios.get(`/skillz/tasks/${userId}`)
      .then(getData)
      .catch(handleError);
  },
});
