/* eslint-disable prefer-arrow-callback */
import { context,
         example,
         it } from 'spec/client/helpers/helpers';

import formModel from 'app/models/form';

describe('formModel', function () {
  context('validate(<schema>)', function () {
    return formModel.validate(this.schema, this.form);
  }, function () {
    beforeEach(function () {
      this.form = formModel.create('edit');
      this._schema = jasmine.createSpyObj('schema', ['validate']);
      this._schema.validate
        .and.callFake(() => this.validation);
      this.validation = {};
      this.schema = () => this._schema;
    });

    it('should validate form\'s <edit> with <schema>', function () {
      expect(this._schema.validate)
        .toHaveBeenCalledWith('edit', { abortEarly: false });
    });

    context('when there is no error', function () {
      this.validation = { error: null };
    }, function () {
      it('should return valid form', function () {
        expect(formModel.isValid(this.context))
          .toBe(true);
      });
    });

    context('when there are errors', function () {
      this.validation = { error: { details: [
        { path: 'field1', message: 'error11' },
        { path: 'field1', message: 'error12' },
        { path: 'field2', message: 'error2' },
      ] } };
    }, function () {
      it('should return invalid form', function () {
        expect(formModel.isValid(this.context))
          .toBe(false);
      });

      it('should set fields errors', function () {
        expect(formModel.fieldError('field1', this.context))
          .toBe('error11');
        expect(formModel.fieldError('field2', this.context))
          .toBe('error2');
      });
    });
  });

  context('fieldValue(<field_path>)', function () {
    return formModel.fieldValue(this.field, this.form);
  }, function () {
    beforeEach(function () {
      this.form = formModel.create({
        field1: 'value1',
        field2: 'value2',
      });
    });

    example(function (exple, desc) {
      context(desc, function () {
        this.field = exple.field;
      }, function () {
        it('should extract <field> value', function () {
          expect(this.context)
            .toBe(exple.value);
        });
      });
    }, [
      ['field'     , 'value' ],
      [['field1']  , 'value1'],
      [['field2']  , 'value2'],
      [['unknown'] , null    ],
    ]);
  });

  context('updateFieldValue(<field_path>, <value>)', function () {
    return formModel.updateFieldValue(this.field, 'value', this.form);
  }, function () {
    beforeEach(function () {
      this.form = formModel.create({
        field1: 'value1',
        field2: 'value2',
      });
    });

    example(function (exple, desc) {
      context(desc, function () {
        this.field = exple.field;
      }, function () {
        it('should update <field>\'s value', function () {
          expect(formModel.fieldValue(this.field, this.context))
            .toBe('value');
        });
      });
    }, [
      ['field'     , 'value' ],
      [['field1']  , 'value1'],
      [['field2']  , 'value2'],
      [['unknown'] , null    ],
    ]);
  });
});
