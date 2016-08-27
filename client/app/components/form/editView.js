export let __hotReload = true;

import R from 'app/helpers/ramda';
import log from 'app/helpers/log';
import styles from 'app/helpers/styles';
import React from 'react';
import pureRenderMixin from 'react-addons-pure-render-mixin';
import subscriptionsMixin from 'app/mixins/subscriptions';
import { formSub } from 'app/components/form/sub';
import { dispatch } from 'app/services/state';
import { Icon } from 'app/components/misc/misc';

export const FormEdit = styles.decorator(React.createClass({
  displayName: 'FormEdit',
  mixins: [ subscriptionsMixin, pureRenderMixin ],
  subscriptions: {
    form: formEditFormSubscription
  },
  childContextTypes: {
    formView: React.PropTypes.object,
    formName: React.PropTypes.string
  },
  getInitialState: formEditGetInitialState,
  getChildContext: formEditGetChildContext,
  render: formEditRender,
  onSubmit: formEditOnSubmit
}));

function formEditFormSubscription() {
  log.cycle('form getSub', this.props);
  return formSub([this.props.name, () => this.props.schema]);
}

function formEditRender() {
  log.cycle('form render', this.props, this.state);
  return (
    <form noValidate
          onSubmit={this.onSubmit}>
      <fieldset className="group">
        <legend className="legend">
          {this.props.label}
        </legend>
        {this.props.children}
        <button className={{
                  'submit': true,
                  'disabled': !!this.state.form.error
                }}
                type="submit"
                onClick={this.onSubmit}>
          <Icon name="check" />
        </button>
      </fieldset>
    </form>
  );
}

function formEditGetInitialState() {
  this.onSubmit = R.bind(this.onSubmit, this);
  return {};
}

function formEditGetChildContext() {
  log.cycle('form.getChildContext', this.views.form, this.props.name);
  return {
    formView: this.views.form,
    formName: this.props.name
  };
}

function formEditOnSubmit(e) {
  e.preventDefault();
  if(this.state.form.error) return;
  dispatch([this.props.onSubmit]);
}
