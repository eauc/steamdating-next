export let __hotReload = true;

import R from 'app/helpers/ramda';
import log from 'app/helpers/log';
import { React, createComponent } from 'app/helpers/react';
import ReactDOM from 'react-dom';
import { dispatch } from 'app/services/state';
import { formFieldSub, formErrorSub } from 'app/components/form/sub';

export const FormInput = createComponent({
  displayName: 'FormInput',
  subscriptions: {
    value: formInputValueSubscription,
    error: formInputErrorSubscription,
  },
  contextTypes: {
    formView: React.PropTypes.object,
    formName: React.PropTypes.string,
  },
  render: formInputRender,
  getInitialState: formInputGetInitialState,
  componentDidMount: formInputComponentDidMount,
  update: formInputUpdate,
  dispatchUpdate: formInputDispatchUpdate,
});

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
  const hasError = !R.isEmpty(error);
  const hasValue = ( !R.isNil(this.state.value) &&
                     !R.isEmpty(this.state.value)
                   );
  const clear = this.state.pristine && !hasValue;
  const showError = !clear && hasError;
  const showValid = !clear && !hasError;
  const className = {
    input: true,
    'input-pristine': this.state.pristine,
    'input-valid': showValid,
    'input-error': showError,
  };
  const props = R.pick(['required','type','order','multiple','placeholder'], this.props);
  let input;
  if ('textarea' === this.props.type) {
    input = (
      <textarea
         ref="input"
         id={this.path}
         className={className}
         name={this.props.name}
         value={this.state.value || ''}
         onChange={this.update}
         {...props}
         />
    );
  }
  else if ('select' === this.props.type) {
    const options = R.thread(this.props.options)(
      R.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      )),
      R.when(
        () => !this.props.multiple,
        R.prepend((<option key="null" value=""></option>))
      )
    );
    input = (
      <select
         ref="input"
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
         ref="input"
         id={this.path}
         className={className}
         name={this.props.name}
         value={this.state.value || ''}
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
        {showError ? error : ''}
      </p>
    </div>
  );
}

function formInputGetInitialState() {
  this.path = `${this.context.formName}.${this.props.name}`;
  this.update = R.bind(this.update, this);
  this.dispatchUpdate = R.debounce(300, R.bind(this.dispatchUpdate, this));
  return {
    value: (this.props.multiple ? [] : null),
    pristine: true,
  };
}

function formInputComponentDidMount() {
  if (this.props.autofocus) {
    self.setTimeout(() => {
      ReactDOM.findDOMNode(this.refs.input).focus();
    }, 100);
  }
}

function formInputUpdate(event) {
  let value = event.target.value;
  if (this.props.multiple) {
    value = R.thread(event.target.options)(
      R.filter(R.prop('selected')),
      R.map(R.prop('value'))
    );
  }
  this.setState({
    value,
    pristine: false,
  });
  this.dispatchUpdate(value);
}

function formInputDispatchUpdate(value) {
  log.cycle('form-input dispatch', this.path);
  dispatch(['form-update', this.path, value]);
}
