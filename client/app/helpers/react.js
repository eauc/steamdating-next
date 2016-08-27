import React from 'react';
import ReactPerf from 'react-addons-perf';
import {whyDidYouUpdate} from 'why-did-you-update';

self.ReactPerf = ReactPerf;
if(self.STEAMDATING_CONFIG.debug) {
  whyDidYouUpdate(React);
}
