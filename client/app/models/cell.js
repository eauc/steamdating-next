export let __hotReload = true;

import R from 'app/helpers/ramda';
import log from 'app/helpers/log';

const cellModel = {
  from: cellFrom,
  resolveCells,
  dump: cellDump,
};

export default cellModel;

function cellDump(cell) {
  return R.pick(['_name', '_args', '_tick', '_value'], cell);
}

function resolveCells(cells) {
  R.forEach((cell) => cell.sample(), cells);
}

function cellCreate(props) {
  return Object.assign({
    _value: undefined,
    _updateValue: cellUpdateValue,
    _onChange: function () {
      log.cell('onChange empty', this._name);
    },
    sample: cellSample,
    value: cellValue,
    changes: cellChanges,
    map: cellMap,
    join: cellJoin,
  }, props);
}

function cellChanges(fn) {
  this._onChange = fn;
  return this;
}

function cellFrom(source) {
  let _computeValue = source;
  if (R.type(_computeValue) !== 'Function') {
    _computeValue = R.always(_computeValue);
  }
  _computeValue = memoize(_computeValue);
  return cellCreate({
    _value: _computeValue(),
    _sources: [],
    _computeValue,
  });
}

function cellMap(fn) {
  const _computeValue = memoize(fn);
  return cellCreate({
    _value: _computeValue(this.value()),
    _sources: [this],
    _computeValue,
  });
}

function cellJoin(other) {
  const _computeValue = memoize((value1, value2) => [value1, value2]);
  return cellCreate({
    _value: _computeValue(this.value(), other.value()),
    _sources: [this, other],
    _computeValue,
  });
}

function cellSample() {
  log.cell('sample', this._name);
  const sourcesValues = R.map((source) => source.sample(), this._sources);
  log.cell('sample sources', this._name, sourcesValues);
  const newValue = this._computeValue(...sourcesValues);
  log.cell('sample newValue', this._name, newValue);
  this._updateValue(newValue);
  return newValue;
}

function cellUpdateValue(value) {
  if (this._value !== value) {
    log.cell('sample changed', this._name, value);
    this._onChange(value);
  }
  this._value = value;
}

function cellValue() {
  return this._value;
}

function memoize(fun) {
  let previousArgs = [];
  let previousValue = undefined;
  let firstTime = true;
  return function (...args) {
    const argsChanged = R.addIndex(R.reduce)((changed, arg, index) => (
      changed || (arg !== previousArgs[index])
    ), false, args);
    previousArgs = args;

    log.cell('memoize argsChanged', args, argsChanged, firstTime);
    if (!firstTime &&
        !R.isEmpty(args) &&
        !argsChanged) return previousValue;

    firstTime = false;
    const value = fun(...args);
    previousValue = value;
    log.cell('memoize eval', value);
    return value;
  };
}
