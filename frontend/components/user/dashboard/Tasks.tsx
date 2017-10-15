import * as React from 'react';
import { connect } from 'react-redux';
import { Col, Panel, ListGroup, ListGroupItem, Badge } from 'react-bootstrap';
import { actionCreators } from '../../../modules/user/tasks';
import * as selectors from '../../../modules/user';

type TasksProps = { // TODO: Fix types.
  tasks: any,
  loading: boolean,
  error?: { message?: string },
  userId: string,
  retrieveTasks: (userId: string) => void,
  resetTasks: () => void,
};

// TODO: Extract this out.
const renderTasksList = (tasks, loading) => {
  if (loading) {
    return (<ListGroup fill/>);
  }

  return (
    <ListGroup fill>
      {
        tasks.length > 0
          ? tasks.map(t => <ListGroupItem key={t.message + t.link} href={t.link}>{t.message}</ListGroupItem>)
          : <ListGroupItem key="no_outstanding_tasks">You don't have any outstanding tasks</ListGroupItem>
      }
    </ListGroup>
  );
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
    // TODO: Col is not concenrn of tasks.
    if (error) {
      return (
        <Col xs={6} md={6}>
          <h3>Tasks</h3>
          <Panel className="task__panel" header={<h4>Something went wrong</h4>} bsStyle="danger">
            {error.message || `A problem occurred when trying to load your tasks.`}
          </Panel>
        </Col>
      );
    }

    return (
      <Col xs={6} md={6}>
        <h3>Tasks{' '}
          {loading ? false : <Badge className="tasks__count">{tasks && tasks.length}</Badge>}
        </h3>
        <Panel className="task__panel">{renderTasksList(tasks, loading)}</Panel>
      </Col>
    );
  }
}

export default connect(
  (state, props) => ({
    tasks: selectors.getTasks(state), // TODO: This always needs to return an array.
    loading: selectors.getTasksLoadingState(state),
    error: selectors.getTasksError(state),
  }),
  dispatch => ({
    retrieveTasks: userId => dispatch(actionCreators.retrieveTasks(userId)),
    resetTasks: userId => dispatch(actionCreators.resetTasks()),
  }),
)(Tasks);
