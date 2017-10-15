import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Col, Grid, Row, Tabs, Tab, Badge } from 'react-bootstrap';

import Tasks from './Tasks';
import UserDetails from './UserDetails';
import EvaluationTable from './EvaluationTable';
import EvaluationsList from './../EvaluationsList';
import * as selectors from '../../../modules/user';

import './dashboard.scss';

type DashboardProps = UserInitialState & { taskCount: number };

const taskTitle = (taskCount): any => <span>Tasks{' '}<Badge className="tasks__count">{taskCount}</Badge></span>;

const Dashboard = ({ userDetails, mentorDetails, lineManagerDetails, template, evaluations, menteeEvaluations, reportsEvaluations, taskCount }: DashboardProps) => {
  if (!userDetails) {
    return (
      <Grid>
        <Button bsStyle="primary" bsSize="large" href="/auth/github">Log In</Button>
      </Grid>
    );
  }

  return (
    <Grid>
      <Tabs defaultActiveKey={1} id="dashboard-tabs">
        <Tab eventKey={1} title={taskTitle(taskCount)}>
          <Row>
            <Col xs={6} md={6}>
              <Tasks userId={userDetails.id}/>
            </Col>
          </Row>
        </Tab>
        <Tab eventKey={2} title="My evaluations">
          <Row>
            <Col xs={12} md={12}>
              <EvaluationsList evaluations={evaluations}/>
            </Col>
          </Row>
        </Tab>
        <Tab eventKey={3} title="Mentee evaluations">
          <Row>
            <Col xs={12} md={12}>
              <EvaluationTable evaluations={menteeEvaluations}/>
            </Col>
          </Row>
        </Tab>
        <Tab eventKey={4} title="Report evaluations">
          <Row>
            <Col xs={12} md={12}>
              <EvaluationTable evaluations={reportsEvaluations}/>
            </Col>
          </Row>
        </Tab>
        <Tab eventKey={5} title="My details">
          <Row>
            <Col xs={12} md={12}>
              <UserDetails
                user={userDetails}
                mentor={mentorDetails}
                lineManager={lineManagerDetails}
                template={template}
              />
            </Col>
          </Row>
        </Tab>
      </Tabs>
    </Grid>
  );
};

export const DashboardPage = connect(
  (state) => {
    return ({
      ...state.user,
      taskCount: selectors.getTaskCount(state),
    });
  },
)(Dashboard);
