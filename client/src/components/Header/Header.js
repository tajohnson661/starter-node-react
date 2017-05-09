import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/MenuItem';
import { Toolbar, ToolbarGroup, ToolbarSeparator } from 'material-ui/Toolbar';

export class Header extends Component {
  renderLoggedInLinks() {
    if (this.props.authenticated) {
      // Show links for when the user is logged in
      return [
        <MenuItem
          key={1}
          containerElement={<Link to="/notes" />}
          primaryText="Notes"
        />,
        <MenuItem
          key={2}
          containerElement={<Link to="/tags" />}
          primaryText="Tags"
        />
      ];
    }
  }

  renderAuthLinks() {
    if (this.props.authenticated) {
      // Show links for when the user is logged in
      return [
        <MenuItem
          key={99}
          containerElement={<Link to="/signout" />}
          primaryText="Sign out"
        />
      ];
    }
    // Show links to sign in or sign up if not logged in
    return [
      <MenuItem
        key={97}
        containerElement={<Link to="/signin" />}
        primaryText="Sign in"
      />,
      <MenuItem
        key={98}
        containerElement={<Link to="/signup" />}
        primaryText="Sign up"
      />
    ];
  }

  render() {
    return (
      <Toolbar>
        <ToolbarGroup>
          <MenuItem
            containerElement={<Link to="/" />}
            primaryText="Home"
            leftIcon={
              <FontIcon className="material-icons">people</FontIcon>
            }
          />
          {this.renderLoggedInLinks()}
        </ToolbarGroup>
        <ToolbarGroup>
          {this.renderAuthLinks()}
          <ToolbarSeparator />
          <IconMenu
            iconButtonElement={
              <IconButton touch={true}>
                <NavigationExpandMoreIcon />
              </IconButton>
            }
          >
            <MenuItem primaryText="Something goes here" />
            <MenuItem primaryText="More Info" />
          </IconMenu>
        </ToolbarGroup>
      </Toolbar>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated
  };
}

export default connect(mapStateToProps)(Header);
