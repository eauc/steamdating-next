import R from 'app/helpers/ramda';
import { beforeEach,
         context,
         example,
         it } from 'spec/client/helpers/helpers';

import cellModel from 'app/models/cell';

import stateModel from 'app/models/state';
import subscriptionsModel from 'app/models/subscriptions';

describe('stateModel', function () {
  beforeEach(function () {
    this.stateContext = stateModel.createContext();
    this.subscriptionsContext = subscriptionsModel.createContext();
  });

  context('resolveEvent([<event>, <args>])', function () {
    return stateModel
      .resolveEvent([this.event, this.args], this.stateContext);
  }, function () {
    beforeEach(function () {
      this.event = 'myEvent';
      this.args = ['arg1','arg2'];
      this.handler = jasmine.createSpy('eventHandler');
    });
    context('when <event> has no handler', function () {
      this.expectContextError();
      this.event = 'whatever';
    }, function () {
      it('should reject <event>', function () {
        expect(this.contextError)
          .toEqual(['Event Ignored']);
      });
    });

    context('when <event> has a handler', function () {
      this.stateContext = stateModel
        .registerHandler(this.event,
                         this.handlerAndMiddlewares,
                         this.stateContext);
    }, function () {
      beforeEach(function () {
        this.handlerAndMiddlewares = [this.handler];
      });

      it('should call handler with <args>', function () {
        expect(this.handler)
          .toHaveBeenCalledWith({}, ['myEvent','arg1','arg2']);
      });

      context('when handler uses middlewares', function () {
        this.handlerAndMiddlewares = [
          this.middlewares,
          this.handler,
        ];
      }, function () {
        beforeEach(function () {
          this.middleware1 = (handler) => {
            this.middlewareSpy1 = jasmine
              .createSpy('middlewareSpy1')
              .and.callFake((state, event) => R.over(
                R.lensProp('myEvent'),
                (event) => `${event}.M1`,
                handler(state, R.append('A1', event))
              ));
            return this.middlewareSpy1;
          };
          this.middleware2 = (handler) => {
            this.middlewareSpy2 = jasmine
              .createSpy('middlewareSpy2')
              .and.callFake((state, event) => R.over(
                R.lensProp('myEvent'),
                (event) => `${event}.M2`,
                handler(state, R.append('A2', event))
              ));
            return this.middlewareSpy2;
          };
          this.middleware3 = (handler) => {
            this.middlewareSpy3 = jasmine
              .createSpy('middlewareSpy3')
              .and.callFake((state, event) => R.over(
                R.lensProp('myEvent'),
                (event) => `${event}.M3`,
                handler(state, R.append('A3', event))
              ));
            return this.middlewareSpy3;
          };
          this.middlewares = [
            this.middleware1,
            [
              this.middleware2,
              this.middleware3,
            ],
          ];

          this.handler
            .and.callFake((state, [event, ...args]) =>
                          R.assoc(event, args.join('.'), state));
        });

        it('should call each middlewares & handler correctly', function () {
          expect(this.handler)
            .toHaveBeenCalledWith({}, [
              'myEvent',...this.args,
              'A1','A2','A3',
            ]);
          expect(this.middlewareSpy3)
            .toHaveBeenCalledWith({}, [
              'myEvent',...this.args,
              'A1','A2',
            ]);
          expect(this.middlewareSpy2)
            .toHaveBeenCalledWith({}, [
              'myEvent',...this.args,
              'A1',
            ]);
          expect(this.middlewareSpy1)
            .toHaveBeenCalledWith({}, [
              'myEvent',...this.args,
            ]);

          expect(this.context.STATE)
            .toEqual({ myEvent: 'arg1.arg2.A1.A2.A3.M3.M2.M1' });
        });
      });

      context('when handler throws error', function () {
        this.expectContextError();
        this.handler
          .and.callFake(() => { throw new Error('oups'); });
      }, function () {
        it('should reject <event>', function () {
          expect(this.contextError)
            .toEqual(['Error in Event Handler']);
        });
      });

      context('when handler does not change state', function () {
        this.handler
          .and.callFake(R.nthArg(0));
      }, function () {
        it('should resolve <event> with the same <stateContext>', function () {
          expect(this.context)
            .toBe(this.stateContext);
        });
      });

      context('when handler changes state', function () {
        this.handler
          .and.callFake((state, [event, ...args]) =>
                        R.assoc(event, args, state));
      }, function () {
        beforeEach(function () {
          self.STEAMDATING_CONFIG.debug = true;
          this.validatorSchema1 = {
            type: 'array',
            item: { type: 'string' },
          };
          this.validatorSchema2 = {
            type: 'object',
            properties: {
              myEvent: this.validatorSchema1,
            },
          };
          this.stateContext = stateModel
            .registerValidator('validator1', ['myEvent'], this.validatorSchema1, this.stateContext);
          this.stateContext = stateModel
            .registerValidator('validator2', [], this.validatorSchema2, this.stateContext);
        });

        context('when a validator fails', function () {
          this.expectContextError();
          this.validatorSchema2.properties
            .myEvent = { type: 'string' };
        }, function () {
          it('should reject <event>', function () {
            expect(this.contextError)
              .toEqual(['Invalid State']);
          });
        });

        it('should resolve <event> with the state returned by the handler', function () {
          expect(this.context.STATE)
            .toEqual({ myEvent: this.args });
        });
      });
    });
  });

  context('resolveCells()', function () {
    return subscriptionsModel
      .resolveCells(this.subscriptionsContext)
      .then(() => subscriptionsModel.advanceTick(this.subscriptionsContext))
      .then((subscriptionsModel) => {
        this.subscriptionsModel = subscriptionsModel;
      });
  }, function () {
    const value2 = { subpath: 'value2' };

    beforeEach(function () {
      this.stateCell = cellModel.from(() => this.stateContext.STATE);

      this.stateContext = stateModel
        .registerHandler('event', [function (state, [_event_, path, value]) {
          return R.assocPath(path, value, state);
        }], this.stateContext);
      this.subscriptionsContext = subscriptionsModel
        .registerSubscription('view', function (stateCell, [_view_, ...path]) {
          return stateCell.map(R.pathOr('default', path));
        }, this.subscriptionsContext);

      const {
        cell: view1,
        context: newSubscriptionsContext1,
      } = subscriptionsModel
              .getSubscription('view', ['path1'], this.stateCell, this.subscriptionsContext);
      this.view1 = view1;
      this.view1Changes = jasmine.createSpy('view1Changes');
      this.view1.changes(this.view1Changes);

      const {
        cell: view2,
        context: newSubscriptionsContext2,
      } = subscriptionsModel
              .getSubscription('view', ['path2'], this.stateCell, newSubscriptionsContext1);
      this.view2 = view2;
      this.view2Changes = jasmine.createSpy('view2Changes');
      this.view2.changes(this.view2Changes);
      this.subscriptionsContext = newSubscriptionsContext2;

      return R.threadP(this.stateContext)(
        stateModel.resolveEvent$(['event', [['path1'], 'value1']]),
        stateModel.resolveEvent$(['event', [['path2'], value2]]),
        R.tap((stateContext) => { this.stateContext = stateContext; }),
        () => subscriptionsModel.resolveCells(this.subscriptionsContext),
        () => subscriptionsModel.advanceTick(this.subscriptionsContext),
        (subscriptionsContext) => {
          this.subscriptionsContext = subscriptionsContext;
          this.view1Changes.calls.reset();
          this.view2Changes.calls.reset();
        }
      );
    });

    context('when state change does not affect views', function () {
      return stateModel
        .resolveEvent(['event', [this.eventArgsPath, this.eventArgsValue]], this.stateContext)
        .then((stateContext) => { this.stateContext = stateContext; });
    }, function () {
      example(function (exple, desc) {
        context(desc, function () {
          this.eventArgsPath = exple.eventArgsPath;
          this.eventArgsValue = exple.eventArgsValue;
        }, function () {
          it('should not update views', function () {
            expect(this.view1Changes).not.toHaveBeenCalled();
            expect(this.view2Changes).not.toHaveBeenCalled();
          });
        });
      }, [
        ['eventArgsPath', 'eventArgsValue'],
        [['path1'], 'value1'],
        [['path2'], value2],
        [['other'], 'value'],
      ]);
    });

    context('when state change does affects views', function () {
      return stateModel
        .resolveEvent(['event', [this.eventArgsPath, this.eventArgsValue]], this.stateContext)
        .then((stateContext) => { this.stateContext = stateContext; });
    }, function () {
      example(function (exple, desc) {
        context(desc, function () {
          this.eventArgsPath = exple.eventArgsPath;
          this.eventArgsValue = exple.eventArgsValue;
        }, function () {
          it('should update affected views', function () {
            expect(this[`${exple.affectedView}Changes`])
              .toHaveBeenCalledWith(exple.changesValue);
            expect(this[`${exple.unaffectedView}Changes`])
              .not.toHaveBeenCalled();
          });
        });
      }, [
        ['eventArgsPath','eventArgsValue','affectedView','changesValue', 'unaffectedView'],
        [['path1'], 'value', 'view1', 'value', 'view2'],
        [['path2'], 'value', 'view2', 'value', 'view1'],
        [['path2', 'subpath'], 'value', 'view2', { subpath: 'value' }, 'view1'],
      ]);
    });

    context('when view is revoked and state changes', function () {
      this.subscriptionsContext = subscriptionsModel
        .revokeView(this.view1, this.subscriptionsContext);
      return stateModel.resolveEvent(['event', [['path1'], 'value']], this.stateContext)
        .then((stateContext) => { this.stateContext = stateContext; });
    }, function () {
      it('should not update revoked view', function () {
        expect(this.view1Changes).not.toHaveBeenCalled();
      });
    });
  });

  describe('history', function () {
    beforeEach(function () {
      this.stateCell = cellModel.from(() => this.stateContext.STATE);

      this.stateContext = stateModel
        .registerHandler('event', [function (state, [_event_, path, value]) {
          return R.assocPath(path, value, state);
        }], this.stateContext);
      this.subscriptionsContext = subscriptionsModel
        .registerSubscription('view', function (stateCell, [_view_, ...path]) {
          return stateCell.map(R.pathOr('default', path));
        }, this.subscriptionsContext);

      const {
        cell: view1,
        context: newSubscriptionsContext,
      } = subscriptionsModel
              .getSubscription('view', ['path1'], this.stateCell, this.subscriptionsContext);
      this.view1 = view1;
      this.view1Changes = jasmine.createSpy('view1Changes');
      this.view1.changes(this.view1Changes);
      this.subscriptionsContext = newSubscriptionsContext;

      return R.threadP(this.stateContext)(
        stateModel.resolveEvent$(['event', [['path1'], 'value1']]),
        stateModel.resolveEvent$(['event', [['path1'], 'value2']]),
        stateModel.resolveEvent$(['event', [['path1'], 'value3']]),
        stateModel.resolveEvent$(['event', [['path1'], 'value4']]),
        R.tap((stateContext) => { this.stateContext = stateContext; }),
        () => subscriptionsModel.resolveCells(this.subscriptionsContext),
        () => subscriptionsModel.advanceTick(this.subscriptionsContext),
        (subscriptionsContext) => {
          this.subscriptionsContext = subscriptionsContext;
          this.view1Changes.calls.reset();
        }
      );
    });

    context('back()', function () {
      return R.threadP(this.stateContext)(
        stateModel.back,
        R.tap((stateContext) => { this.stateContext = stateContext; }),
        () => subscriptionsModel.resolveCells(this.subscriptionsContext),
        () => subscriptionsModel.advanceTick(this.subscriptionsContext),
        R.tap((subscriptionsContext) => {
          this.subscriptionsContext = subscriptionsContext;
        })
      );
    }, function () {
      example(function (exple, desc) {
        context(desc, function () {
          this.stateContext = R.reduce(
            (mem) => stateModel.back(mem),
            this.stateContext,
            R.repeat(null, exple.nBack - 1)
          );
        }, function () {
          it('should rewind state', function () {
            expect(this.view1Changes)
              .toHaveBeenCalledWith(exple.value);
          });
        });
      }, [
        ['nBack', 'value'],
        [1, 'value3'],
        [2, 'value2'],
        [3, 'value1'],
        [4, 'value1'],
      ]);

      context('dropHistory(<index>)', function () {
        this.stateContext = stateModel
          .dropHistory(1, this.stateContext);
      }, function () {
        example(function (exple, desc) {
          context(desc, function () {
            this.stateContext = R.reduce(
              (mem) => stateModel.back(mem),
              this.stateContext,
              R.repeat(null, exple.nBack - 1)
            );
          }, function () {
            it('should remove <index> from state history', function () {
              expect(this.view1Changes)
                .toHaveBeenCalledWith(exple.value);
            });
          });
        }, [
          ['nBack', 'value'],
          [1, 'value3'],
          [2, 'value1'],
          [3, 'value1'],
        ]);
      });
    });

    context('first()', function () {
      return R.threadP(this.stateContext)(
        stateModel.first,
        R.tap((stateContext) => { this.stateContext = stateContext; }),
        () => subscriptionsModel.resolveCells(this.subscriptionsContext),
        () => subscriptionsModel.advanceTick(this.subscriptionsContext),
        R.tap((subscriptionsContext) => {
          this.subscriptionsContext = subscriptionsContext;
        })
      );
    }, function () {
      it('should rewind to first state', function () {
        expect(this.view1Changes)
          .toHaveBeenCalledWith('value1');
      });
    });

    context('redo()', function () {
      return R.threadP(this.stateContext)(
        stateModel.redo,
        R.tap((stateContext) => { this.stateContext = stateContext; }),
        () => subscriptionsModel.resolveCells(this.subscriptionsContext),
        () => subscriptionsModel.advanceTick(this.subscriptionsContext),
        R.tap((subscriptionsContext) => {
          this.subscriptionsContext = subscriptionsContext;
        })
      );
    }, function () {
      beforeEach(function () {
        return R.threadP(this.stateContext)(
          stateModel.first,
          R.tap((stateContext) => { this.stateContext = stateContext; }),
          () => subscriptionsModel.resolveCells(this.subscriptionsContext),
          () => subscriptionsModel.advanceTick(this.subscriptionsContext),
          R.tap((subscriptionsContext) => {
            this.subscriptionsContext = subscriptionsContext;
            this.view1Changes.calls.reset();
          })
        );
      });

      example(function (exple, desc) {
        context(desc, function () {
          this.stateContext = R.reduce(
            (mem) => stateModel.redo(mem),
            this.stateContext,
            R.repeat(null, exple.nRedo - 1)
          );
        }, function () {
          it('should redo state', function () {
            expect(this.view1Changes)
              .toHaveBeenCalledWith(exple.value);
          });
        });
      }, [
        ['nRedo', 'value'],
        [1, 'value2'],
        [2, 'value3'],
        [3, 'value4'],
        [4, 'value4'],
      ]);

      context('dropLog(<index>)', function () {
        this.stateContext = stateModel
          .dropLog(1, this.stateContext);
      }, function () {
        example(function (exple, desc) {
          context(desc, function () {
            this.stateContext = R.reduce(
              (mem) => stateModel.redo(mem),
              this.stateContext,
              R.repeat(null, exple.nRedo - 1)
            );
          }, function () {
            it('should drop <index> from state log', function () {
              expect(this.view1Changes)
                .toHaveBeenCalledWith(exple.value);
            });
          });
        }, [
          ['nRedo', 'value'],
          [1, 'value2'],
          [2, 'value4'],
          [3, 'value4'],
        ]);
      });
    });

    context('last()', function () {
      return R.threadP(this.stateContext)(
        stateModel.last,
        R.tap((stateContext) => { this.stateContext = stateContext; }),
        () => subscriptionsModel.resolveCells(this.subscriptionsContext),
        () => subscriptionsModel.advanceTick(this.subscriptionsContext),
        R.tap((subscriptionsContext) => {
          this.subscriptionsContext = subscriptionsContext;
        })
      );
    }, function () {
      beforeEach(function () {
        return R.threadP(this.stateContext)(
          stateModel.first,
          R.tap((stateContext) => { this.stateContext = stateContext; }),
          () => subscriptionsModel.resolveCells(this.subscriptionsContext),
          () => subscriptionsModel.advanceTick(this.subscriptionsContext),
          R.tap((subscriptionsContext) => {
            this.subscriptionsContext = subscriptionsContext;
            this.view1Changes.calls.reset();
          })
        );
      });

      it('should redo to last state', function () {
        expect(this.view1Changes)
          .toHaveBeenCalledWith('value4');
      });
    });
  });
});
