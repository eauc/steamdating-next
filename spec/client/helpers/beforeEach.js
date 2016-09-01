import R from 'app/helpers/ramda';

const jasmine_beforeEach = self.beforeEach;
export function beforeEach(fn) {
  jasmine_beforeEach(function(done) {
    new self.Promise((resolve, reject) => {
      try {
        resolve(R.bind(fn, this)(done));
      }
      catch(e) {
        reject(e);
      }
    }).catch((error) => {
      expect('This setup').toBe('not rejected');
      expect(error).toBe(null);
    }).then(() => {
      if(R.length(fn) === 0) {
        done();
      }
    });
  });
}
