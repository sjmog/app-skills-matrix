import * as React from 'react';
import { connect } from 'react-redux';
import { Panel, ListGroup, ListGroupItem } from 'react-bootstrap';
import { actionCreators } from '../../../modules/user/tasks';
import { Link } from 'react-router';
import * as selectors from '../../../modules/user';

type TasksProps = {
  tasks: TaskViewModel[],
  loading: boolean,
  error?: { message?: string },
  userId: string,
  fetched: boolean,
  retrieveTasks: (userId: string) => void,
  resetTasks: () => void,
};

class Tasks extends React.Component<TasksProps> {
  componentWillUnmount() {
    this.props.resetTasks();
  }

  componentDidMount() {
    const { retrieveTasks, userId, loading } = this.props;

    if (!loading) {
      retrieveTasks(userId);
    }
  }

  render() {
    const { loading, tasks, error, fetched } = this.props;

    if (error) {
      return (
        <Panel className="tasks__panel" header={<h4>Something went wrong</h4>} bsStyle="danger">
          {error.message || `A problem occurred when loading your tasks.`}
        </Panel>
      );
    }

    if (loading || !fetched) {
      return <Panel className="tasks__panel"><ListGroup fill/></Panel>;
    }

    return (
      <Panel className="tasks__panel">
        <ListGroup fill>
          {
            tasks.length > 0
              ? tasks.map(t => <Link to={t.link} className="list-group-item">{t.message}</Link>)
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
    fetched: selectors.getFetchedState(state),
  }),
  dispatch => ({
    retrieveTasks: userId => dispatch(actionCreators.retrieveTasks(userId)),
    resetTasks: () => dispatch(actionCreators.resetTasks()),
  }),
)(Tasks);
