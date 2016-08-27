export let __hotReload = true;

import log from 'app/helpers/log';
import styles from 'app/helpers/styles';
import React from 'react';
import pureRenderMixin from 'react-addons-pure-render-mixin';
import subscriptionsMixin from 'app/mixins/subscriptions';
import { formSub } from 'app/components/form/sub';
import { dispatch } from 'app/services/state';

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
  render: formEditRender
}));

function formEditFormSubscription() {
  log.cycle('form getSub', this.props);
  return formSub([this.props.name, () => this.props.schema]);
}

function formEditRender() {
  log.cycle('form', this.props, this.state);
  return (
    <form noValidate>
      <fieldset className="group">
        <legend className="legend">
          {this.props.label}
        </legend>
        {this.props.children}
      </fieldset>
    </form>
  );
}

function formEditGetInitialState() {
  return {};
}

function formEditGetChildContext() {
  log.cycle('form.getChildContext', this.views.form, this.props.name);
  return {
    formView: this.views.form,
    formName: this.props.name
  };
}
