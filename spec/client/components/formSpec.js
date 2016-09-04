import { beforeEach,
         context,
         it } from 'spec/client/helpers/helpers';

import { formResetHandler,
         formUpdateHandler } from 'app/components/form/handler';

describe('formComponent', function() {
  beforeEach(function() {
    this.state = {};
  });

  context('formResetHandler(<name>, <value>)', function() {
    return formResetHandler(this.state, ['name', 'value']);
  }, function() {
    it('should setup form <name> with <value>', function() {
      expect(this.context)
        .toEqual({name: { base: 'value', edit: 'value' } });
    });
  });

  context('formUpdateHandler(<form.field>, <value>)', function() {
    return formUpdateHandler(this.state, ['form.field', 'value']);
  }, function() {
    it('should update form\'s field with <value>', function() {
      expect(this.context)
        .toEqual({form: { edit: { field: 'value' } } });
    });
  });
});
