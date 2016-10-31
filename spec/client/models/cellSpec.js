import { beforeEach,
         it } from 'spec/client/helpers/helpers';

import cellModel from 'app/models/cell';

describe('cellModel', function () {
  describe('from(<sourceFnOrValue>)', function () {
    beforeEach(function () {
      this.sourceFn = jasmine.createSpy('source')
        .and.returnValue('source');
      this.fromFn = cellModel.from(this.sourceFn);
      this.fromValue = cellModel.from(42);
      this.cells = [this.fromFn, this.fromValue];

      this.fromFnChanges = jasmine.createSpy('fromFnChanges');
      this.fromFn.changes(this.fromFnChanges);
      this.fromValueChanges = jasmine.createSpy('fromValueChanges');
      this.fromValue.changes(this.fromValueChanges);
    });

    it('should have correct initial value', function () {
      expect(this.sourceFn).toHaveBeenCalled();
      expect(this.sourceFn.calls.count()).toBe(1);
      expect(this.fromFn.value()).toBe('source');

      expect(this.fromValue.value()).toBe(42);
    });

    describe('when cells are resolved', function () {
      beforeEach(function () {
        this.sourceFn.calls.reset();
        this.sourceFn.and.returnValue('source2');

        return cellModel
          .resolveCells(1, this.cells);
      });

      it('should sample source & update value', function () {
        expect(this.sourceFn).toHaveBeenCalled();
        expect(this.sourceFn.calls.count()).toBe(1);
        expect(this.fromFn.value()).toBe('source2');

        expect(this.fromValue.value()).toBe(42);

        expect(this.fromFnChanges)
          .toHaveBeenCalledWith('source2');
        expect(this.fromFnChanges.calls.count())
          .toBe(1);
        expect(this.fromValueChanges)
          .not.toHaveBeenCalled();
      });

      describe('when cells are resolved again at same tick', function () {
        beforeEach(function () {
          this.sourceFn.calls.reset();
          this.sourceFn.and.returnValue('source3');

          this.fromFnChanges.calls.reset();
          this.fromValueChanges.calls.reset();

          return cellModel
            .resolveCells(1, this.cells);
        });

        it('should return same value & not resample source', function () {
          expect(this.sourceFn).not.toHaveBeenCalled();
          expect(this.fromFn.value()).toBe('source2');

          expect(this.fromValue.value()).toBe(42);

          expect(this.fromFnChanges)
            .not.toHaveBeenCalled();
          expect(this.fromValueChanges)
            .not.toHaveBeenCalled();
        });
      });

      describe('when cells are resolved again at another tick', function () {
        beforeEach(function () {
          this.sourceFn.calls.reset();
          this.sourceFn.and.returnValue('source3');

          this.fromFnChanges.calls.reset();
          this.fromValueChanges.calls.reset();

          return cellModel
            .resolveCells(2, this.cells);
        });

        it('should sample source & update value', function () {
          expect(this.sourceFn).toHaveBeenCalled();
          expect(this.sourceFn.calls.count()).toBe(1);
          expect(this.fromFn.value()).toBe('source3');

          expect(this.fromValue.value()).toBe(42);

          expect(this.fromFnChanges)
            .toHaveBeenCalledWith('source3');
          expect(this.fromFnChanges.calls.count())
            .toBe(1);
          expect(this.fromValueChanges)
            .not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('<cell>.join(<other>)', function () {
    beforeEach(function () {
      this.source1 = jasmine.createSpy('source1')
        .and.returnValue('source1_1');
      this.source2 = jasmine.createSpy('source2')
        .and.returnValue('source2_1');
      this.cell1 = cellModel.from(this.source1);
      this.cell2 = cellModel.from(this.source2);
      this.joinCell = this.cell1.join(this.cell2);
      this.cells = [this.joinCell, this.cell1, this.cell2];

      this.joinChanges = jasmine.createSpy('joinChanges');
      this.joinCell.changes(this.joinChanges);
    });

    it('should have correct initial value', function () {
      expect(this.joinCell.value())
        .toEqual(['source1_1', 'source2_1']);
    });

    describe('when cells are resolved', function () {
      beforeEach(function () {
        this.source1.calls.reset();
        this.source2.calls.reset();
        return cellModel
          .resolveCells(1, this.cells);
      });

      it('should sample each source only once', function () {
        expect(this.source1.calls.count()).toBe(1);
        expect(this.source2.calls.count()).toBe(1);
      });
    });

    describe('when none of the joined cells values change', function () {
      beforeEach(function () {
        this.previousValue = this.joinCell.value();
        return cellModel
          .resolveCells(1, this.cells);
      });

      it('should not change value', function () {
        expect(this.joinCell.value())
          .toBe(this.previousValue);

        expect(this.joinChanges)
          .not.toHaveBeenCalled();
      });
    });

    describe('when value of the left cell changes', function () {
      beforeEach(function () {
        this.source1.and.returnValue('source1_2');
        return cellModel
          .resolveCells(1, this.cells);
      });

      it('should update joined value', function () {
        expect(this.joinCell.value())
          .toEqual(['source1_2', 'source2_1']);

        expect(this.joinChanges)
          .toHaveBeenCalledWith(['source1_2', 'source2_1']);
        expect(this.joinChanges.calls.count())
          .toBe(1);
      });
    });

    describe('when value of the right cell changes', function () {
      beforeEach(function () {
        this.source2.and.returnValue('source2_2');
        return cellModel
          .resolveCells(1, this.cells);
      });

      it('should update joined value', function () {
        expect(this.joinCell.value())
          .toEqual(['source1_1', 'source2_2']);

        expect(this.joinChanges)
          .toHaveBeenCalledWith(['source1_1', 'source2_2']);
        expect(this.joinChanges.calls.count())
          .toBe(1);
      });
    });

    describe('when both cells values change', function () {
      beforeEach(function () {
        this.source1.and.returnValue('source1_2');
        this.source2.and.returnValue('source2_2');
        return cellModel
          .resolveCells(1, this.cells);
      });

      it('should update joined value', function () {
        expect(this.joinCell.value())
          .toEqual(['source1_2', 'source2_2']);

        expect(this.joinChanges)
          .toHaveBeenCalledWith(['source1_2', 'source2_2']);
        expect(this.joinChanges.calls.count())
          .toBe(1);
      });
    });
  });

  describe('<cell>.map(<mapFn>)', function () {
    beforeEach(function () {
      this.source = jasmine.createSpy('source')
        .and.returnValue('source_1');
      this.sourceCell = cellModel.from(this.source);

      this.mapFn = jasmine.createSpy('mapFn')
        .and.callFake((value) => ({ mapped: value }));
      this.mapCell = this.sourceCell.map(this.mapFn);

      this.cells = [this.mapCell, this.sourceCell];

      this.mapChanges = jasmine.createSpy('mapChanges');
      this.mapCell.changes(this.mapChanges);
    });

    it('should have correct initial value', function () {
      expect(this.mapCell.value())
        .toEqual({ mapped: 'source_1' });

      expect(this.mapFn)
        .toHaveBeenCalledWith('source_1');
      expect(this.mapFn.calls.count())
        .toBe(1);
    });

    describe('when cells are resolved', function () {
      beforeEach(function () {
        this.source.calls.reset();
        return cellModel
          .resolveCells(1, this.cells);
      });

      it('should sample source only once', function () {
        expect(this.source.calls.count())
          .toBe(1);
      });
    });

    describe('when source value does not change', function () {
      beforeEach(function () {
        this.initialValue = this.mapCell.value();
        this.mapFn.calls.reset();
        return cellModel
          .resolveCells(1, this.cells);
      });

      it('should not call <mapFn> and not change value', function () {
        expect(this.mapFn)
          .not.toHaveBeenCalled();
        expect(this.mapCell.value())
          .toBe(this.initialValue);

        expect(this.mapChanges)
          .not.toHaveBeenCalled();
      });
    });

    describe('when source value changes', function () {
      beforeEach(function () {
        this.mapFn.calls.reset();

        this.source.and.returnValue('source_2');
        return cellModel
          .resolveCells(1, this.cells);
      });

      it('should call <mapFn> once and update mapped value', function () {
        expect(this.mapFn)
          .toHaveBeenCalledWith('source_2');
        expect(this.mapFn.calls.count())
          .toBe(1);

        expect(this.mapCell.value())
          .toEqual({ mapped: 'source_2' });

        expect(this.mapChanges)
          .toHaveBeenCalledWith({ mapped: 'source_2' });
      });
    });
  });
});
