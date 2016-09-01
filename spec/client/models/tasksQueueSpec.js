import { beforeEach,
         context,
         it } from 'spec/client/helpers/helpers';

import tasksQueueModel from 'app/models/tasksQueue';

describe('tasksQueueModel', function() {
  describe('push(<[task, ...args]>)', function() {
    beforeEach(function() {
      this.queue = tasksQueueModel.create();

      this.state = { value: 'init' };

      this.task1 = jasmine.createSpy('task1')
        .and.callFake((s) => { s.value += '|task1'; return 'task1';});
      this.task2 = jasmine.createSpy('task2')
        .and.callFake((s) => { s.value += '|task2'; return 'task2'; });
    });

    context('', function() {
      tasksQueueModel
        .push([wrapTask(this.task1), this.state], this.queue);
      return tasksQueueModel
        .push([wrapTask(this.task2), this.state], this.queue);
    }, function() {
      it('should execute tasks in push order', function() {
        expect(this.task1)
          .toHaveBeenCalledWith(this.state);
        expect(this.task2)
          .toHaveBeenCalledWith(this.state);
        expect(this.state.value).toBe('init|task1|task2');
      });

      it('should resolve with <task>\'s promise result', function() {
        expect(this.context).toBe('task2');
      });
    });

    context('when <task>\'s result is rejected', function() {
      this.expectContextError();
      tasksQueueModel
        .push([wrapTask(this.task1), this.state], this.queue);
      return tasksQueueModel
        .push([wrapErrorTask(this.task2), this.state], this.queue);
    }, function() {
      it('should reject with <task>\'s promise reject', function() {
        expect(this.contextError).toEqual(['task2Error']);
      });
    });

    context('when <task> throws an error', function() {
      this.expectContextError();
      return tasksQueueModel
        .push([wrapThrowTask(this.task1), this.state], this.queue);
    }, function() {
      it('should reject with <task>\'s promise reject', function() {
        expect(this.contextError).toEqual(['task1Throw']);
      });
    });

    context('when <task> throws an error, with other tasks following', function() {
      tasksQueueModel
        .push([wrapThrowTask(this.task1), this.state], this.queue);
      return tasksQueueModel
        .push([wrapTask(this.task2), this.state], this.queue);
    }, function() {
      it('should execute following tasks', function() {
        expect(this.task2)
          .toHaveBeenCalledWith(this.state);
        expect(this.context).toBe('task2');
        expect(this.state.value).toBe('init|task1|task2');
      });
    });
  });
});

function wrapTask(task) {
  return ([resolve, _rej_, state]) => {
    resolve(task(state));
  };
}

function wrapErrorTask(task) {
  return ([_res_, reject, state]) => {
    reject(task(state)+'Error');
  };
}

function wrapThrowTask(task) {
  return ([_res_, _rej_, state]) => {
    return self.Promise.reject(task(state)+'Throw');
  };
}
