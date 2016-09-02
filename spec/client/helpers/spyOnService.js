import R from 'app/helpers/ramda';
import { spyOnPromise } from 'spec/client/helpers/spyOnPromise';

export function spyOnService(service, name='service') {
  R.thread(service)(
    R.keys,
    R.filter(R.compose(R.equals('Function'), R.type, R.prop(R.__, service))),
    R.reject(R.compose(R.equals('$'), R.last)),
    R.forEach(spyOnMethod)
  );

  function spyOnMethod(key) {
    const mock_return_value = `${name}.${key}.returnValue`;
    const arity = R.length(service[key]);
    if(R.last(key) === 'P') {
      spyOnPromise(service, key)
        .resolveWith(mock_return_value);
    }
    else {
      spyOn(service, key)
        .and.returnValue(mock_return_value);
    }
    service[key+'$'] = R.curryN(arity, service[key]);
  }
}
