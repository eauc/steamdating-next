import R from 'app/helpers/ramda';

const jasmine_it = self.it;
export function it(desc, test) {
  // console.log('it', desc);
  return jasmine_it(desc, it.wrapper(test));
}

it.wrapper = function wrapper(test) {
  return function wrappedTest(done) {
    // console.info('wrapper', 'base');
    return new self.Promise((resolve, reject) => {
      try {
        resolve(test.apply(this, [done]));
      }
      catch(e) {
        reject(e);
      }
    }).catch((error) => {
      expect('This test').toBe('not rejected');
      expect(error).toBe(null);
    }).then(() => {
      if(R.length(test) === 0) {
        // console.log('wrapper', 'base', 'auto done');
        done();
      }
    });
  };
};
it.wrapper._debug = 'it';
