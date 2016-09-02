import { context,
         example,
         it } from 'spec/client/helpers/helpers';

import formModel from 'app/models/form';

describe('formModel', function() {
  context('validate(<schema>)', function() {
    return formModel.validate(this.schema, this.form);
  }, function() {
    beforeEach(function() {
      this.form = { edit: 'edit', base: 'base' };
      this._schema = jasmine.createSpyObj('schema', ['validate']);
      this._schema.validate
        .and.callFake(() => this.validation);
      this.validation = {};
      this.schema = () => this._schema;
    });

    it('should validate form\'s <edit> with <schema>', function() {
      expect(this._schema.validate)
        .toHaveBeenCalledWith('edit', { abortEarly: false});
    });

    context('when there is no error', function() {
      this.validation = { error: null };
    }, function() {
      it('should return valid form', function() {
        expect(this.context)
          .toEqual({ edit: 'edit', base: 'base', error: null });
      });
    });

    context('when there are errors', function() {
      this.validation = { error: { details: [
        { path: 'field1', message: 'error11' },
        { path: 'field1', message: 'error12' },
        { path: 'field2', message: 'error2' },
      ] } };
    }, function() {
      it('should return form with formated errors', function() {
        expect(this.context)
          .toEqual({ edit: 'edit', base: 'base', error: {
            details: { field1: [{ path: 'field1', message: 'error11' },
                                { path: 'field1', message: 'error12' }],
                       field2: [{ path: 'field2', message: 'error2' }]
                     }
          }});
      });
    });
  });

  describe('isValid()', function() {
    example(function(e, d) {
      it(`should check whether <form> has error, ${d}`, function() {
        expect(formModel.isValid(e.form))
          .toBe(e.isValid);
      });
    }, [
      [ 'form'         , 'isValid' ],
      [ {}             , true      ],
      [ { error:null } , true      ],
      [ { error: {} }  , false     ],
    ]);
  });

  describe('formFieldValue(<field_path>)', function() {
    beforeEach(function() {
      this.form = {
        edit: { field1: 'value1',
                field2: 'value2'
              }
      };
    });

    example(function(e, d) {
      it(`should extract <field> value, ${d}`, function() {
        expect(formModel.fieldValue(e.field, this.form))
          .toBe(e.value);
      });
    }, [
      [ 'field'     , 'value'   ],
      [ ['field1']  , 'value1'  ],
      [ ['field2']  , 'value2'  ],
      [ ['unknown'] , undefined ],
    ]);
  });

  describe('formFieldValue(<field_path>)', function() {
    beforeEach(function() {
      this.form = {
        error: { details: { field1: [{ message: 'error1' }],
                            field2: [{ message: 'error2' }],
                            field3: []
                          }
               }
      };
    });

    example(function(e, d) {
      it(`should extract <field> error or "", ${d}`, function() {
        expect(formModel.fieldError(e.field, this.form))
          .toBe(e.error);
      });
    }, [
      [ 'field'   , 'error'  ],
      [ 'field1'  , 'error1' ],
      [ 'field2'  , 'error2' ],
      [ 'field3'  , ''       ],
      [ 'unknown' , ''       ],
    ]);
  });
});
