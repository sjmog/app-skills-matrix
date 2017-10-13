import * as React from 'react';
import { connect } from 'react-redux';
import { Grid, Row } from 'react-bootstrap';

import UserDetails from './UserDetails';
import MyEvaluations from './MyEvaluations';
import EvaluationTable from './EvaluationTable';

// TODO: fix types
type DashboardProps = {
  userDetails: any,
  mentorDetails: any,
  template: any,
  evaluations: any[],
  menteeEvaluations: any[],
  reportsEvaluations: any[],
};

const Dashboard = ({ userDetails, mentorDetails, template, evaluations, menteeEvaluations, reportsEvaluations }: DashboardProps) => (
  <Grid>
    {
      userDetails
        ? <div>
          <Row>
            <UserDetails
              user={userDetails}
              mentor={mentorDetails}
              template={template}
            />
          </Row>
          <Row>
            <MyEvaluations
              evaluations={evaluations}
            />
          </Row>
          <Row>
            <EvaluationTable
              evaluations={menteeEvaluations}
              title="Mentee Evaluations"
            />
          </Row>
          <Row>
            <EvaluationTable
              evaluations={reportsEvaluations}
              title=""
            />
          </Row>
        </div>
        : <h1>{'You aren\'t logged in!'}</h1>
    }
  </Grid>
);

export const DashboardPage = connect(
  state => state.user,
)(Dashboard);
