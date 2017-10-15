import * as React from 'react';
import { connect } from 'react-redux';
import { Panel, ListGroup, ListGroupItem } from 'react-bootstrap';
import { actionCreators } from '../../../modules/user/tasks';
import * as selectors from '../../../modules/user';

type TasksProps = {
  tasks: TaskList,
  loading: boolean,
  error?: { message?: string },
  userId: string,
  retrieveTasks: (userId: string) => void,
  resetTasks: () => void,
};

class Tasks extends React.Component<TasksProps, any> {
  componentWillUnmount() {
    this.props.resetTasks();
  }

  componentDidMount() {
    this.props.retrieveTasks(this.props.userId);
  }

  render() {
    const { loading, tasks, error } = this.props;

    if (error) {
      return (
        <Panel className="task__panel" header={<h4>Something went wrong</h4>} bsStyle="danger">
          {error.message || `A problem occurred when loading your tasks.`}
        </Panel>
      );
    }

    if (loading) {
      return <Panel className="task__panel"><ListGroup fill/></Panel>;
    }

    return (
      <Panel className="task__panel">
        <ListGroup fill>
          {
            tasks.length > 0
              ? tasks.map(t => <ListGroupItem key={t.message + t.link} href={t.link}>{t.message}</ListGroupItem>)
              : <ListGroupItem key="no_outstanding_tasks">You don't have any outstanding tasks</ListGroupItem>
          }
        </ListGroup>
      </Panel>
    );
  }
}

export default connect(
  (state, props) => ({
    tasks: selectors.getTasks(state),
    loading: selectors.getTasksLoadingState(state),
    error: selectors.getTasksError(state),
  }),
  dispatch => ({
    retrieveTasks: userId => dispatch(actionCreators.retrieveTasks(userId)),
    resetTasks: userId => dispatch(actionCreators.resetTasks()),
  }),
)(Tasks);
