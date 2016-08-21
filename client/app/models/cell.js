export let __hotReload = true;

import R from 'ramda';
// import log from 'app/helpers/log';

const cellModel = {
  from: cellFrom,
  resolveCells
};

export default cellModel;

function cellCreate(props) {
  const _source = R.always(null);
  return Object.assign({
    _source: _source,
    _value: undefined,
    _onChange: cellNoop,
    _setValue: cellSetValue,
    resetTick: cellResetTick,
    sample: _source,
    map: cellMap,
    changes: cellChanges
  }, props);
}

function cellFrom(source) {
  if(R.type(source) !== 'Function') {
    source = R.always(source);
  }
  return cellCreate({
    _source: { sample: source },
    sample: cellSampleWith(R.identity)
  });
}

function cellSampleWith(fn) {
  return function cellSample(tick) {
    // log('cell sample', tick, this._tick, this._value, this._new_value);
    if(tick === this._tick) return self.Promise.resolve(this._value);
    if(undefined !== this._new_value) return self.Promise.resolve(this._new_value);
    // log('cell sample eval');
    return self.Promise
      .resolve(this._source.sample())
      .then(fn)
      .then((value) => this._setValue(value));
  };
}

function cellSetValue(value) {
  // log('cell setValue before', this._value, this._new_value);
  this._new_value = this._value;
  if(undefined === value) return undefined;
  // log('cell setValue input change');
  if(this._value === value) return undefined;
  // log('cell setValue state  change');
  this._new_value = value;
  this._onChange(value);
  // log('cell setValue after', this._value, this._new_value);
  return value;
}

function cellResetTick(tick) {
  // log('cell resetTick before', tick, this._tick, this._value, this._new_value);
  this._value = this._new_value;
  this._new_value = undefined;
  this._tick = tick;
  // log('cell resetTick after', tick, this._tick, this._value, this._new_value);
}

function cellMap(fn) {
  return cellCreate({
    _source: this,
    sample: cellSampleWith((value) => ((undefined !== value) ? fn(value) : undefined))
  });
}

function cellChanges(fn) {
  this._onChange = fn;
  return this;
}

function cellNoop() {}

function resolveCells(tick, cells) {
  return _resolveCells(tick, cells)
    .then(() => {
      R.forEach((c) => c.resetTick(tick), cells);
    });
}

function _resolveCells(tick, [cell, ...rest] = []) {
  if(undefined === cell) return null;
  return cell.sample(tick)
    .then(() => _resolveCells(tick, rest));
}
