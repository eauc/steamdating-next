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

function cellFrom(source) {
  let sourceFn = source;
  if (R.type(sourceFn) !== 'Function') {
    sourceFn = R.always(sourceFn);
  }
  return cellCreate({
    _value: sourceFn(),
    _source: { sample: sourceFn,
               value: sourceFn,
               resetTick: cellNoop,
             },
  });
}

function resolveCells(tick, cells) {
  return _resolveCells(tick, cells)
    .then(() => {
      R.forEach((cell) => cell.resetTick(tick), cells);
    });
}

function _resolveCells(tick, [cell, ...rest] = []) {
  if (undefined === cell) return self.Promise.resolve();
  return cell.sample(tick)
    .then(() => _resolveCells(tick, rest));
}

const nullSource = {
  value: R.always(undefined),
  sample: () => self.Promise.resolve(undefined),
  resetTick: cellNoop,
};

function cellCreate(props) {
  return Object.assign({
    _source: nullSource,
    _value: undefined,
    _onChange: cellNoop,
    _sampleGetSource: cellDefaultSampleGetSource,
    _sampleTransform: cellDefaultSampleTransform,
    _sampleSetValue: cellSampleSetValue,
    _resetSourceTick: cellDefaultResetSourceTick,
    resetTick: cellResetTick,
    sample: cellSample,
    value: cellValue,
    changes: cellChanges,
    map: cellMap,
    join: cellJoin,
  }, props);
}

function cellNoop() {}

function cellDefaultSampleGetSource(tick) {
  // log.cell(this._name, this._args, 'sampleGetSource :',
  //          'get source');
  return this._source.sample(tick);
}

function cellDefaultSampleTransform(value) {
  return value;
}

function cellDefaultResetSourceTick(tick) {
  this._source.resetTick(tick);
}

function cellSampleSetValue(value) {
  // log.cell(this._name, this._args, 'sampleSetValue :',
  //          'value=', this._value,
  //          'newValue=', this._newValue);
  this._newValue = this._value;
  if (undefined === value) return undefined;
  // log.cell(this._name, this._args, 'sampleSetValue :',
  //         'source has changed');
  if (this._value === value) return undefined;
  // log.cell(this._name, this._args, 'sampleSetValue :',
  //         'value has changed');
  this._newValue = value;
  this._onChange(value);
  // log.cell(this._name, this._args, 'sampleSetValue :',
  //          'value=', this._value,
  //          'newValue=', this._newValue);
  return value;
}

function cellResetTick(tick) {
  // log.cell(this._name, this._args, 'resetTick :',
  //          'tick=', tick, '_tick=', this._tick,
  //          'value=', this._value, 'newValue=', this._newValue);
  if (this._tick === tick) return;
  // log.cell(this._name, this._args, 'resetTick :',
  //          'tick has changed');

  this._value = this._newValue;
  this._newValue = undefined;
  this._tick = tick;

  this._resetSourceTick(tick);
  // log.cell(this._name, this._args, 'resetTick :',
  //          'tick=', tick, '_tick=', this._tick,
  //          'value=', this._value, 'newValue=', this._newValue);
}

function cellSample(tick) {
  // log.cell(this._name, this._args, 'sample :',
  //          'tick=', tick, '_tick=', this._tick,
  //          'value=', this._value, 'newValue=', this._newValue);
  if (tick === this._tick) {
    return self.Promise.resolve(this._value);
  }
  // log.cell(this._name, this._args, 'sample :',
  //          'new tick',
  //          'previous_value=', this._value);
  if (undefined !== this._newValue) {
    return self.Promise.resolve(this._newValue);
  }
  // log.cell(this._name, this._args, 'sample :',
  //          'need to eval');
  return self.Promise
    .resolve(this._sampleGetSource(tick))
    .then((value) => {
      // log.cell(this._name, this._args, 'sample :',
      //          'source_value=', value);
      return this._sampleTransform(value);
    })
    .then((value) => {
      // log.cell(this._name, this._args, 'sample :',
      //          'transform_value=', v);
      const finalValue = this._sampleSetValue(value);
      log.cell(this._name, this._args, 'sample :',
               'final_value=', finalValue);
      return finalValue;
    });
}

function cellValue() {
  return ( undefined !== this._newValue
           ? this._newValue
           : this._value
         );
}

function cellChanges(fn) {
  this._onChange = fn;
  return this;
}

function cellMap(fn) {
  return cellCreate({
    _value: fn(this.value()),
    _source: this,
    _sampleTransform(value) {
      return ((undefined !== value) ? fn(value) : undefined);
    },
  });
}

function cellJoin(other) {
  return cellCreate({
    _value: [this.value(), other.value()],
    _source: [this, other],
    _sampleGetSource: (tick) => self.Promise.all([
      this.sample(tick),
      other.sample(tick),
    ]),
    _sampleTransform: cellJoinTransform,
    _resetSourceTick: cellJoinResetSourceTick,
  });
}

function cellJoinTransform([thisValue, otherValue]) {
  if (undefined === thisValue &&
     undefined === otherValue) return undefined;
  if (undefined === thisValue) return [this._value[0], otherValue];
  if (undefined === otherValue) return [thisValue, this._value[1]];
  return [thisValue, otherValue];
}

function cellJoinResetSourceTick(tick) {
  this._source[0].resetTick(tick);
  this._source[1].resetTick(tick);
}
