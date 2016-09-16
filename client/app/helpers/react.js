import React from 'react';
import ReactPerf from 'react-addons-perf';

self.ReactPerf = ReactPerf;
if(self.STEAMDATING_CONFIG.debug) {
  System.import('why-did-you-update')
    .then(({whyDidYouUpdate}) => {
      whyDidYouUpdate(React);
    });
}
