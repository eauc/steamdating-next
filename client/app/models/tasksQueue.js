export let __hotReload = true;

import log from 'app/helpers/log';

const tasksQueueModel = {
  create: tasksQueueCreate,
  push: tasksQueuePush,
};

export default tasksQueueModel;

function tasksQueueCreate() {
  return {
    queue: [],
    timeout: null,
  };
}

/* eslint-disable no-param-reassign */
function tasksQueuePush([task, ...args], tqueue) {
  log.tasks('push', args);
  return new self.Promise((resolve, reject) => {
    tqueue.queue.push([task, resolve, reject, ...args]);
    if (!tqueue.timeout) {
      log.tasks('push reschedule');
      tqueue.timeout = self.setTimeout(() => dispatchTasksQueue(tqueue), 1);
    }
  });
}

function dispatchTasksQueue(tqueue) {
  log.tasks('push dispatch', tqueue.queue.length);
  const [task, ...rest] = tqueue.queue;
  if (undefined === task) {
    tqueue.timeout = null;
    return;
  }
  log.tasks('push !empty');
  tqueue.queue = rest;
  const [fn, resolve, reject, ...args] = task;
  self.Promise.resolve(fn([resolve, reject, ...args]))
    .catch((error) => {
      tqueue.timeout = null;
      reject(error);
    })
    .then(() => {
      log.tasks('push resolved-reschedule');
      tqueue.timeout = self.setTimeout(() => dispatchTasksQueue(tqueue), 1);
    });
}
