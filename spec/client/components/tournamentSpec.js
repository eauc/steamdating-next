import { beforeEach,
         context,
         it,
         spyOnService } from 'spec/client/helpers/helpers';

import { tournamentOpenHandler,
         tournamentOpenSuccessHandler,
         tournamentSetHandler,
         tournamentSetConfirmHandler } from 'app/components/tournament/handler';

import fileService from 'app/services/file';
import stateService from 'app/services/state';

describe('tournamentComponent', function() {
  beforeEach(function() {
    this.state = {};
    spyOnService(fileService, 'file');
    spyOnService(stateService, 'state');
  });

  context('tournamentOpenHandler(<file>)', function() {
    return tournamentOpenHandler(this.state, ['file']);
  }, function() {
    it('should try to read <file>', function() {
      expect(fileService.readP)
        .toHaveBeenCalledWith('file');
    });

    context('when file read succeeds', function() {
      fileService.readP.resolveWith('data');
    }, function() {
      it('should set tournament to read data', function() {
        expect(stateService.dispatch)
          .toHaveBeenCalledWith(['tournament-openSuccess', 'data']);
      });
    });

    context('when file read fails', function() {
      fileService.readP.resolveWith(undefined);
    }, function() {
      it('should set error', function() {
        expect(stateService.dispatch)
          .toHaveBeenCalledWith(['toaster-set', {
            type: 'error',
            message: 'Invalid file'
          }]);
      });
    });
  });

  context('tournamentOpenSuccessHandler(<data>)', function() {
    return tournamentOpenSuccessHandler(this.state, ['data']);
  }, function() {
    it('should notify file loaded', function() {
      expect(stateService.dispatch)
        .toHaveBeenCalledWith(['toaster-set', {
          type: 'success',
          message: 'File loaded'
        }]);
    });

    it('should set tournament data', function() {
      expect(stateService.dispatch)
        .toHaveBeenCalledWith(['tournament-set', 'data']);
    });
  });

  context('tournamentSetHandler(<data>)', function() {
    return tournamentSetHandler(this.state, ['data']);
  }, function() {
    it('should prompt user for confirmation', function() {
      expect(stateService.dispatch)
        .toHaveBeenCalledWith([
          'prompt-set',
          { type: 'confirm',
            msg: 'All previous data will be replaced. You sure ?',
            onOk: ['tournament-setConfirm', 'data'] }
        ]);
    });
  });

  context('tournamentSetConfirmHandler(<data>)', function() {
    return tournamentSetConfirmHandler(this.state, ['data']);
  }, function() {
    it('should set <data> as current tournament', function() {
      expect(this.context)
        .toBe('data');
    });
  });
});
