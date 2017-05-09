import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { signOutUser } from '../../actions/auth_actions';

export class Signout extends Component {
  componentDidMount() {
    this.props.signOutUser();
  }

  render() {
    return (
      <div>
        <h2>Bye...</h2>
        <Link className="button" to="/"> Go to home </Link >
      </div>
    );
  }
}

export default connect(null, { signOutUser })(Signout);
