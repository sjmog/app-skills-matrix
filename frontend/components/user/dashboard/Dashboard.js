import React, { PropTypes } from "react";
import { connect } from "react-redux";

import UserDetails from "./UserDetails";

export class Dashboard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {
          this.props.user
            ? <div>
                <h1 className="header">Dashboard</h1>
                <UserDetails
                  user={this.props.user}
                />
              </div>
            : <h1>{`You aren't logged in!`}</h1>
        }
      </div>
    );
  }
}

Dashboard.propTypes = {
  user: PropTypes.object,
};

export const DashboardPage = connect(
  function mapStateToProps(state) {
    return state.dashboard;
  }
)(Dashboard);
