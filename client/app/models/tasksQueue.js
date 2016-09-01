export let __hotReload = true;

const tasksQueueModel = {
  create: tasksQueueCreate,
  push: tasksQueuePush
};

export default tasksQueueModel;

function tasksQueueCreate() {
  return {
    queue: [],
    timeout: null
  };
}

function tasksQueuePush([task, ...args], tqueue) {
  return new self.Promise((resolve, reject) => {
    tqueue.queue.push([task, resolve, reject, ...args]);
    if(!tqueue.timeout) {
      tqueue.timeout = self.setTimeout(() => dispatchTasksQueue(tqueue), 1);
    }
  });
}

function dispatchTasksQueue(tqueue) {
  tqueue.timeout = null;
  const [task, ...rest] = tqueue.queue;
  if(undefined === task) return;
  tqueue.queue = rest;
  const [fn, resolve, reject, ...args] = task;
  self.Promise.resolve(fn([resolve, reject, ...args]))
    .catch((e) => { reject(e); })
    .then(() => {
      tqueue.timeout = self.setTimeout(() => dispatchTasksQueue(tqueue), 1);
    });
}
