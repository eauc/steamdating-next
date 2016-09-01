import R from 'app/helpers/ramda';

RegExp.prototype.toJSON = RegExp.prototype.toString;
export function example(func, vals) {
  const keys = R.head(vals);
  R.thread(vals)(
    R.tail,
    R.map((row) => R.addIndex(R.reduce)((mem, k, i) => {
      mem[k] = row[i];
      return mem;
    }, {}, keys)),
    R.forEach((e) => {
        func(e, exampleDesc(e));
    })
  );
}

function exampleDesc(obj) {
  return 'with { ' + R.thread(obj)(
    R.keys,
    R.map((k) => {
      return k + ': ' +
        (R.type(obj[k]) === 'Function' ?
         'func()' :
         JSON.stringify(obj[k])
        );
    }),
    R.join(', ')
  ) + ' }';
}
