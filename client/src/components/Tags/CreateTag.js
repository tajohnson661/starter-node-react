import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, initialize, Field } from 'redux-form';
import { Link } from 'react-router';
import { TextField } from 'redux-form-material-ui';
import RaisedButton from 'material-ui/RaisedButton';
import { createOrUpdateTag, fetchTag, clearTag } from '../../actions/tags_actions';

// validation functions
const required = value => (!value ? 'Required' : undefined);

// in-line styles
const buttonStyle = {
  margin: 12
};

export class CreateOrUpdateTag extends Component {
  constructor() {
    super();
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.params && this.props.params.id) {
      // We're editing an existing tag.
      this.props.fetchTag(this.props.params.id);
    } else {
      this.props.clearTag();
    }

    this.refs.name        // the Field
      .getRenderedComponent() // on Field, returns ReduxFormMaterialUITextField
      .getRenderedComponent() // on ReduxFormMaterialUITextField, returns TextField
      .focus();               // on TextField
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.currentTag !== nextProps.currentTag) {
      this.props.initialize(nextProps.currentTag);
    }
  }

  handleFormSubmit(values) {
    this.props.createOrUpdateTag(values, this.props.params ? this.props.params.id : null);
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

  render() {
    const { handleSubmit, pristine, submitting, reset } = this.props;

    return (
      <form onSubmit={handleSubmit(this.handleFormSubmit)}>
        <div>
          <Field
            name="name"
            component={TextField}
            hintText="Add a tag"
            floatingLabelText="Tag text"
            validate={[required]}
            ref="name" withRef
          />
        </div>

        {this.renderAlert()}
        <div>
          <RaisedButton
            type="submit"
            disabled={pristine || submitting}
            label="Submit"
            primary={true}
            style={buttonStyle}
          />
          <Link to="/tags">Cancel</Link>
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

CreateOrUpdateTag.propTypes = {
  createOrUpdateTag: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  return {
    errorMessage: state.tags.error,
    currentTag: state.tags.currentTag
  };
}

const CreateOrUpdateTagForm = reduxForm({
  form: 'createOrUpdateTag'  // name of form.  Redux will put this in our application state
})(CreateOrUpdateTag);

// We'll pass this mergeProps parameter to redux's connect so that we
// can override properties during unit testing.
const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return Object.assign({}, stateProps, dispatchProps, ownProps);
};

export default connect(mapStateToProps,
  { createOrUpdateTag, fetchTag, clearTag, initialize }, mergeProps)(CreateOrUpdateTagForm);
