export let __hotReload = true;

import R from 'ramda';
import log from 'app/helpers/log';

const cellModel = {
  from: cellFrom,
  resolveCells
};

export default cellModel;

function cellFrom(source) {
  if(R.type(source) !== 'Function') {
    source = R.always(source);
  }
  return cellCreate({
    _value: source(),
    _source: { sample: source,
               value: source,
               resetTick: cellNoop
             }
  });
}

function resolveCells(tick, cells) {
  return _resolveCells(tick, cells)
    .then(() => {
      R.forEach((c) => c.resetTick(tick), cells);
    });
}

function _resolveCells(tick, [cell, ...rest] = []) {
  if(undefined === cell) return self.Promise.resolve();
  return cell.sample(tick)
    .then(() => _resolveCells(tick, rest));
}

const null_source = {
  value: R.always(undefined),
  sample: () => self.Promise.resolve(undefined),
  resetTick: cellNoop
};

function cellCreate(props) {
  return Object.assign({
    _source: null_source,
    _value: undefined,
    _onChange: cellNoop,
    _sampleGetSource: cellDefaultSampleGetSource,
    _sampleTransform: cellDefaultSampleTransform,
    _sampleSetValue: cellSampleSetValue,
    resetTick: cellResetTick,
    sample: cellSample,
    value: cellValue,
    changes: cellChanges,
    map: cellMap
  }, props);
}

function cellNoop() {}

function cellDefaultSampleGetSource(tick) {
  log.cell(this._name, this._args, 'sampleGetSource :',
           'get source');
  return this._source.sample(tick);
}

function cellDefaultSampleTransform(value) {
  return value;
}

function cellSampleSetValue(value) {
  // log.cell(this._name, this._args, 'sampleSetValue :',
  //          'value=', this._value,
  //          'new_value=', this._new_value);
  this._new_value = this._value;
  if(undefined === value) return undefined;
  log.cell(this._name, this._args, 'sampleSetValue :',
          'source has changed');
  if(this._value === value) return undefined;
  log.cell(this._name, this._args, 'sampleSetValue :',
          'value has changed');
  this._new_value = value;
  this._onChange(value);
  // log.cell(this._name, this._args, 'sampleSetValue :',
  //          'value=', this._value,
  //          'new_value=', this._new_value);
  return value;
}

function cellResetTick(tick) {
  // log.cell(this._name, this._args, 'resetTick :',
  //          'tick=', tick, '_tick=', this._tick,
  //          'value=', this._value, 'new_value=', this._new_value);
  if(this._tick === tick) return;
  log.cell(this._name, this._args, 'resetTick :',
           'tick has changed');

  this._value = this._new_value;
  this._new_value = undefined;
  this._tick = tick;

  this._source.resetTick(tick);
  // log.cell(this._name, this._args, 'resetTick :',
  //          'tick=', tick, '_tick=', this._tick,
  //          'value=', this._value, 'new_value=', this._new_value);
}

function cellSample(tick) {
  // log.cell(this._name, this._args, 'sample :',
  //          'tick=', tick, '_tick=', this._tick,
  //          'value=', this._value, 'new_value=', this._new_value);
  if(tick === this._tick) return self.Promise.resolve(this._value);
  log.cell(this._name, this._args, 'sample :',
           'new tick',
           'previous_value=', this._value);
  if(undefined !== this._new_value) return self.Promise.resolve(this._new_value);
  log.cell(this._name, this._args, 'sample :',
           'need to eval');
  return self.Promise
    .resolve(this._sampleGetSource(tick))
    .then((v) => {
      log.cell(this._name, this._args, 'sample :',
               'source_value=', v);
      return this._sampleTransform(v);
    })
    .then((v) => {
      log.cell(this._name, this._args, 'sample :',
               'transform_value=', v);
      v = this._sampleSetValue(v);
      log.cell(this._name, this._args, 'sample :',
               'final_value=', v);
      return v;
    });
}

function cellValue() {
  return this._value;
}

function cellChanges(fn) {
  this._onChange = fn;
  return this;
}

function cellMap(fn) {
  return cellCreate({
    _value: fn(this.value()),
    _source: this,
    _sampleTransform: (value) => ((undefined !== value) ? fn(value) : undefined)
  });
}
