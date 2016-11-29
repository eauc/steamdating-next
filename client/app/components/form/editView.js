export let __hotReload = true;

import R from 'app/helpers/ramda';
import log from 'app/helpers/log';
import { dispatch } from 'app/services/state';
import { formSub } from 'app/components/form/sub';
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
  return formSub([this.props.name, () => this.props.schema]);
}

function formEditRender() {
  log.cycle('formEdit render', this.props, this.state);
  return (
    <form noValidate
          onSubmit={this.doSubmit}>
      <fieldset className="group">
        <legend className="legend">
          {this.props.label}
        </legend>
        {this.props.children}
        <button className={{
                  submit: true,
                  disabled: !formModel.isValid(this.state.form),
                }}
                type="submit"
                onClick={this.doSubmit}>
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
  if (this.state.form.error) return;
  if (R.type(this.props.onSubmit) === 'Function') {
    this.props.onSubmit(this.state.form);
  }
  else {
    dispatch([this.props.onSubmit, this.state.form]);
  }
}
