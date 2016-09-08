export let __hotReload = true;

import R from 'app/helpers/ramda';

const fileService = {
  generate: fileGenerate,
  cleanup: fileCleanup
};
export default R.curryService(fileService);

function fileGenerate(data) {
  return R.thread(data)(
    R.jsonStringify(null),
    (string) => new self.Blob([string], {type: 'text/plain'}),
    self.URL.createObjectURL
  );
}

function fileCleanup(url) {
  if(!R.isNil(url)) {
    self.URL.revokeObjectURL(url);
  }
}
