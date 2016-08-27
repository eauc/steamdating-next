export let __hotReload = true;

import R from 'app/helpers/ramda';
import log from 'app/helpers/log';
import styles from 'app/helpers/styles';
import React from 'react';
import pureRenderMixin from 'react-addons-pure-render-mixin';
import subscriptionsMixin from 'app/mixins/subscriptions';
import { dispatch } from 'app/services/state';
import { formFieldSub, formErrorSub } from 'app/components/form/sub';

export const FormInput = styles.decorator(React.createClass({
  displayName: 'FormInput',
  mixins: [ subscriptionsMixin, pureRenderMixin ],
  subscriptions: {
    value: formInputValueSubscription,
    error: formInputErrorSubscription
  },
  contextTypes: {
    formView: React.PropTypes.object,
    formName: React.PropTypes.string
  },
  render: formInputRender,
  getInitialState: formInputGetInitialState,
  update: formInputUpdate,
  dispatchUpdate: formInputDispatchUpdate
}));

function formInputValueSubscription() {
  log.cycle('input valSub', this.context, this.path);
  return formFieldSub([this.context.formView, this.path]);
}

function formInputErrorSubscription() {
  log.cycle('input errSub', this.context, this.path);
  return formErrorSub([this.context.formView, this.path]);
}

function formInputRender() {
  log.cycle('input', this.props, this.state, this.context);
  const error = this.state.error;
  const has_error = !R.isEmpty(error);
  const has_value = ( !R.isNil(this.state.value) &&
                      !R.isEmpty(this.state.value)
                    );
  const clear = this.state.pristine && !has_value;
  const show_error = !clear && has_error;
  const show_valid = !clear && !has_error;
  const className = {
    'input': true,
    'input-pristine': this.state.pristine,
    'input-valid': show_valid,
    'input-error': show_error
  };
  const props = R.pick(['required','type','order'], this.props);
  let input;
  if('textarea' === this.props.type) {
    input = (
      <textarea
         id={this.path}
         className={className}
         name={this.props.name}
         value={this.state.value}
         onChange={this.update}
         {...props}
         />
    );
  }
  else if('select' === this.props.type) {
    const options = R.thread(this.props.options)(
      R.map((o) => (<option key={o} value={o}>{o}</option>)),
      R.prepend((<option key="null" value=""></option>))
    );
    input= (
      <select
         id={this.path}
         className={className}
         name={this.props.name}
         value={this.state.value}
         onChange={this.update}
         {...props}>
        {options}
      </select>
    );
  }
  else {
    input = (
      <input
         id={this.path}
         className={className}
         name={this.props.name}
         value={this.state.value}
         onChange={this.update}
         {...props}
         />
    );
  }
  return (
    <div>
      <label className="label"
             htmlFor={this.id}>
        {this.props.label}
      </label>
      {input}
      <p className="error-info">
        {show_error ? error: ''}
      </p>
    </div>
  );
}

function formInputGetInitialState() {
  this.path = `${this.context.formName}.${this.props.name}`;
  this.update = R.bind(this.update, this);
  this.dispatchUpdate = R.debounce(300, R.bind(this.dispatchUpdate, this));
  return { value: null, pristine: true };
}

function formInputUpdate(e) {
  this.setState({value: e.target.value, pristine: false});
  this.dispatchUpdate(e.target.value);
}

function formInputDispatchUpdate(value) {
  log.cycle('form-input dispatch', this.path);
  dispatch(['form-update', this.path, value]);
}
