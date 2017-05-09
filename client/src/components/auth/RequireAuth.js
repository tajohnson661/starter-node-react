import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export default function (ComposedComponent) {
  class Authentication extends Component {

    componentWillMount() {
      if (!this.props.authenticated) {
        this.context.router.push('/');
      }
    }

    componentWillUpdate(nextProps) {
      // called when about to rerender (new props coming or whatever)
      if (!nextProps.authenticated) {
        this.context.router.push('/');
      }
    }

    render() {
      // console.log('Rendering:', ComposedComponent);
      // console.log('authenticated:', this.props.authenticated);
      // console.log('context:', this.context);
      return (
        <ComposedComponent {...this.props} />
      );
    }
  }

  Authentication.contextTypes = {
    router: PropTypes.object
  };

  function mapStateToProps(state) {
    return {
      authenticated: state.auth.authenticated
    };
  }

  return connect(mapStateToProps)(Authentication);
}
