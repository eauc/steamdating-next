export let __hotReload = true;

import R from 'app/helpers/ramda';
import log from 'app/helpers/log';
import stateService from 'app/services/state';
const { dispatch } = stateService;
import { formValidateSub } from 'app/components/form/sub';
import formModel from 'app/models/form';
/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
import { Icon } from 'app/components/misc/misc';
/* eslint-enable no-unused-vars */

export const FormEdit = createComponent({
  displayName: 'FormEdit',
  subscriptions: {
    form: formEditFormSubscription,
  },
  childContextTypes: {
    formView: React.PropTypes.object,
    formName: React.PropTypes.string,
  },
  getInitialState: formEditGetInitialState,
  getChildContext: formEditGetChildContext,
  render: formEditRender,
  doSubmit: formEditDoSubmit,
});

function formEditFormSubscription() {
  return formValidateSub([this.props.name, () => this.props.schema]);
}

function formEditRender() {
  log.cycle('formEdit render', this.props, this.state);
  const errors = formModel.globalErrors(this.state.form);
  const errorsInfos = R.map((error) => {
    return (
      <p key={error}
         className="error-info">
        {error}
      </p>
    );
  }, errors);
  return (
    <form noValidate
          onSubmit={this.doSubmit}>
      <fieldset className="group">
        <legend className="legend">
          {this.props.label}
        </legend>
        {this.props.children}
        {errorsInfos}
        <button className={{
                  submit: true,
                  disabled: !formModel.isValid(this.state.form),
                }}
                type="submit">
          <Icon name="check" />
        </button>
      </fieldset>
    </form>
  );
}

function formEditGetInitialState() {
  return { form: {} };
}

function formEditGetChildContext() {
  log.cycle('form.getChildContext', this.views.form, this.props.name);
  return {
    formView: this.views.form,
    formName: this.props.name,
  };
}

function formEditDoSubmit(event) {
  event.preventDefault();
  if (this.state.form.error) return false;
  if (R.type(this.props.onSubmit) === 'Function') {
    this.props.onSubmit(this.state.form);
  }
  else {
    dispatch({ eventName: this.props.onSubmit, form: this.state.form });
  }
  return false;
}
