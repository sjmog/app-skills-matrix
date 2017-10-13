import * as React from 'react';
import { connect } from 'react-redux';
import { Grid, Row } from 'react-bootstrap';

import UserDetails from './UserDetails';
import MyEvaluations from './MyEvaluations';
import EvaluationTable from './EvaluationTable';

type DashboardProps = UserInitialState;

const Dashboard = ({ userDetails, mentorDetails, lineManagerDetails, template, evaluations, menteeEvaluations, reportsEvaluations }: DashboardProps) => (
  <Grid>
    {
      userDetails
        ? <div>
          <Row>
            <UserDetails
              user={userDetails}
              mentor={mentorDetails}
              lineManager={lineManagerDetails}
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
