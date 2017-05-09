import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { fetchNotes } from '../../actions/notes_actions';

export class Notes extends Component {
  componentDidMount() {
    this.props.fetchNotes();
  }

  renderTags(tags) {
    if (tags) {
      return (tags.map((tag, idx) => {
        return (
          <li key={idx}>
            <p>{tag.name}</p>
          </li>
        );
      }));
    }
  }
  renderData() {
    const data = this.props.data;
    if (data) {
      return (data.map((note, idx) => {
        return (
          <li key={idx}>
            <Link to={`/notes/${note.id}`}>{note.text}</Link>
            <ul>
              {this.renderTags(note.tags)}
            </ul>
          </li>
        );
      }));
    }
  }

  render() {
    return (
      <div>
        <Link to="/notes/new">Create a new note</Link>
        <ul>
          {this.renderData()}
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.notes.data
  };
}
export default connect(mapStateToProps, { fetchNotes })(Notes);
