import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';

import { fetchNote, deleteNote } from '../../actions/notes_actions';

export class Note extends Component {
  constructor() {
    super();
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    this.props.fetchNote(this.props.params.id);
  }

  handleDelete() {
    this.props.deleteNote(this.props.note.id);
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

  render() {
    if (!this.props.note) {
      return null;
    }
    return (
      <div>
        <div>
          {this.props.note.text}
          <ul>
            {this.renderTags(this.props.note.tags)}
          </ul>
        </div>
        <div>
          <RaisedButton
            label="Delete"
            onClick={this.handleDelete}
          />
        </div>

        <Link to={`/notes/${this.props.note.id}/edit`}>Edit</Link>
        <Link to="/notes">Back to notes</Link>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    note: state.notes.currentNote
  };
}
export default connect(mapStateToProps, { fetchNote, deleteNote })(Note);
