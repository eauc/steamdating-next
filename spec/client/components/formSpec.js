import { beforeEach,
         context,
         it } from 'spec/client/helpers/helpers';
import R from 'app/helpers/ramda';
import formModel from 'app/models/form';

import { formResetHandler,
         formUpdateHandler } from 'app/components/form/handler';

describe('formComponent', function () {
  beforeEach(function () {
    this.state = {};
  });

  context('formResetHandler(<formName>, <value>)', function () {
    return formResetHandler(this.state, { formName: 'name', value: 'value' });
  }, function () {
    it('should setup form <name> with <value>', function () {
      expect(this.context)
        .toEqual({ name: { base: 'value', edit: 'value' } });
    });
  });

  context('formUpdateHandler(<fieldName>, <value>, <updateWith>)', function () {
    return formUpdateHandler(this.state, this.event);
  }, function () {
    beforeEach(function () {
      this.event = { fieldName: 'formName.fieldName.0.data', value: 'value' };
      this.state = { formName: formModel.create({}) };
    });

    context('when no specific update is needed', function () {
    }, function () {
      it('should update form.field\'s value', function () {
        expect(this.context)
          .toEqual({
            formName: {
              base: {},
              edit: { fieldName: { 0: { data: 'value' } } },
            },
          });
      });
    });

    context('when a specific update is needed', function () {
      this.updateWith = (path, value, edit) => R.updateIn(path, `${value}Update`, edit);
      this.event.updateWith = R.curryN(3, this.updateWith);
    }, function () {
      it('should update form.field\'s value', function () {
        expect(this.context)
          .toEqual({
            formName: {
              base: {},
              edit: { fieldName: { 0: { data: 'valueUpdate' } } },
            },
          });
      });
    });
  });
});
