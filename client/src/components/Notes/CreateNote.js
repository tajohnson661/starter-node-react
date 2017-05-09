import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, initialize, Field } from 'redux-form';
import { Link } from 'react-router';
import { TextField, Checkbox } from 'redux-form-material-ui';
import RaisedButton from 'material-ui/RaisedButton';
import { createOrUpdateNote, fetchNote } from '../../actions/notes_actions';
import { fetchTags } from '../../actions/tags_actions';

// validation functions
const required = value => (!value ? 'Required' : undefined);

// in-line styles
const buttonStyle = {
  margin: 12
};

export class CreateOrUpdateNote extends Component {
  constructor() {
    super();
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.params && this.props.params.id) {
      // We're editing an existing note.
      this.props.fetchNote(this.props.params.id);
    }
    // Make sure the tags in the store are up to date
    this.props.fetchTags();

    this.refs.text        // the Field
      .getRenderedComponent() // on Field, returns ReduxFormMaterialUITextField
      .getRenderedComponent() // on ReduxFormMaterialUITextField, returns TextField
      .focus();               // on TextField
  }

  componentWillReceiveProps(nextProps) {
    // We need to initialize the form after we've received the tags and maybe the current note
    // if we're editing an existing note
    // since our data is a mash of both of those requests
    if (this.props.currentNote !== nextProps.currentNote || this.props.tags !== nextProps.tags) {
      const data = this.setCheckedValues(nextProps.currentNote, nextProps.tags);
      // not in docs... from within form component, don't pass form name as first parameter to initialize
      this.props.initialize(data);
    }
  }
  setCheckOnTag(noteTags) {
    return (tag) => {
      return { ...tag, checkedValue: this.isTagOnNote(noteTags, tag) };
    };
  }

  setCheckedValues(note, tags) {
    return {
      note,
      tags: tags ? tags.map(this.setCheckOnTag(note ? note.tags : null)) : null
    };
  }

  isTagOnNote(noteTags, tag) {
    if (!noteTags) {
      return false;
    }
    const idx = noteTags.findIndex(aTag => (aTag.name === tag.name));
    if (idx !== -1) {
      return true;
    }
    return false;
  }

  handleFormSubmit(values) {
    let tags;
    if (values.tags) {
      tags = values.tags.reduce((current, tag) => {
        if (tag.checkedValue) {
          current.push(tag.id);
        }
        return current;
      }, []);
    }
    const data = {
      text: values.note.text,
      tags
    };
    this.props.createOrUpdateNote(data, this.props.params ? this.props.params.id : null);
  }

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
          <strong>Oops!</strong> {this.props.errorMessage}
        </div>
      );
    }
  }

  renderTags() {
    const tags = this.props.tags;
    if (tags) {
      return (tags.map((tag, idx) => {
        return (
          <li key={idx}>
            <Field
              name={`tags[${idx}].checkedValue`}
              component={Checkbox}
              label={tag.name}
            />
          </li>
        );
      }));
    }
  }

  render() {
    const { handleSubmit, pristine, submitting, reset } = this.props;

    return (
      <form onSubmit={handleSubmit(this.handleFormSubmit)}>
        <div>
          <Field
            name="note.text"
            component={TextField}
            multiLine={true}
            rows={5}
            hintText="Add a note"
            floatingLabelText="Note text"
            validate={[required]}
            ref="text" withRef
          />
        </div>

        {this.renderAlert()}
        <div>
          {this.renderTags()}
        </div>

        <div>
          <RaisedButton
            type="submit"
            disabled={pristine || submitting}
            label="Submit"
            primary={true}
            style={buttonStyle}
          />
          <Link to="/notes">Cancel</Link>
          <RaisedButton
            disabled={pristine || submitting}
            label="Clear"
            onClick={reset}
            style={buttonStyle}
          />
        </div>
      </form>
    );
  }
}

CreateOrUpdateNote.propTypes = {
  createOrUpdateNote: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  return {
    errorMessage: state.notes.error,
    currentNote: state.notes.currentNote,
    tags: state.tags.data
  };
}

const CreateOrUpdateNoteForm = reduxForm({
  form: 'createOrUpdateNote'  // name of form.  Redux will put this in our application state
})(CreateOrUpdateNote);

// We'll pass this mergeProps parameter to redux's connect so that we
// can override properties during unit testing.
const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return Object.assign({}, stateProps, dispatchProps, ownProps);
};

export default connect(mapStateToProps,
  { createOrUpdateNote, fetchNote, fetchTags, initialize }, mergeProps)(CreateOrUpdateNoteForm);
