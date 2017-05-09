import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { fetchTags } from '../../actions/tags_actions';

export class Tags extends Component {
  componentDidMount() {
    this.props.fetchTags();
  }

  renderData() {
    const data = this.props.data;
    if (data) {
      return (data.map((tag, idx) => {
        return (
          <li key={idx}>
            <Link to={`/tags/${tag.id}`}>{tag.name}</Link>
          </li>
        );
      }));
    }
  }

  render() {
    return (
      <div>
        <Link to="/tags/new">Create a new tag</Link>
        <ul>
          {this.renderData()}
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.tags.data
  };
}
export default connect(mapStateToProps, { fetchTags })(Tags);
