import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';

import { fetchTag, deleteTag } from '../../actions/tags_actions';

export class Tag extends Component {
  constructor() {
    super();
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    this.props.fetchTag(this.props.params.id);
  }

  handleDelete() {
    this.props.deleteTag(this.props.tag.id);
  }

  render() {
    if (!this.props.tag) {
      return null;
    }
    return (
      <div>
        <div>
          {this.props.tag.name}
        </div>
        <div>
          <RaisedButton
            label="Delete"
            onClick={this.handleDelete}
          />
        </div>
        <Link to={`/tags/${this.props.tag.id}/edit`}>Edit</Link>
        <Link to="/tags">Back to tags</Link>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    tag: state.tags.currentTag
  };
}
export default connect(mapStateToProps, { fetchTag, deleteTag })(Tag);
