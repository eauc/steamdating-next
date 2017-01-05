import { context,
         example,
         it } from 'spec/client/helpers/helpers';

import formModel from 'app/models/form';

describe('formModel', function () {
  context('validate(<schema>)', function () {
    return formModel.validate(this.schema, this.form);
  }, function () {
    beforeEach(function () {
      this.form = formModel.create({});
      const _schema = {
        type: 'object',
        properties: {
          number: { type: 'number' },
          string: { type: 'string' },
        },
        additionnalProperties: false,
      };
      this.schema = () => _schema;
    });

    context('when there is no error', function () {
      this.form.edit.number = 42;
    }, function () {
      it('should return valid form', function () {
        expect(formModel.isValid(this.context))
          .toBe(true);
      });
    });

    context('when there are fields errors', function () {
      this.form.edit = {
        number: 'string',
        string: 42,
      };
    }, function () {
      it('should return invalid form', function () {
        expect(formModel.isValid(this.context))
          .toBe(false);
      });

      it('should set fields errors', function () {
        expect(formModel.fieldError('number', this.context))
          .toBe('should be number');
        expect(formModel.fieldError('string', this.context))
          .toBe('should be string');
      });
    });

    context('when there are global errors', function () {
      this.form.edit = null;
    }, function () {
      it('should return invalid form', function () {
        expect(formModel.isValid(this.context))
          .toBe(false);
      });

      it('should set globals errors', function () {
        expect(formModel.globalErrors(this.context))
          .toEqual(['should be object']);
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

  context('updateFieldValue(<field_path>, <value>, <form.edit>)', function () {
    return formModel.updateFieldValue(this.field, 'value', this.form.edit);
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
          expect(formModel.fieldValue(this.field, { edit: this.context }))
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
