export let __hotReload = true;

import R from 'app/helpers/ramda';

const fileService = {
  generate: fileGenerate,
  cleanup: fileCleanup,
  readP: fileReadP
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

function fileReadP(file) {
  return new self.Promise((resolve, reject) => {
    var reader = new self.FileReader();
    reader.onload = (e) => {
      resolve(R.jsonParse(e.target.result));
    };
    reader.onerror = () => {
      reject(['Error reading file']);
    };
    reader.onabort = () => {
      reject(['Abort reading file']);
    };
    reader.readAsText(file);
  });
}
