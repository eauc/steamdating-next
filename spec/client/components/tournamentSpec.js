import { beforeEach,
         context,
         it,
         spyOnService } from 'spec/client/helpers/helpers';

import { tournamentOpenHandler,
         tournamentSetHandler } from 'app/components/tournament/handler';

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
          .toHaveBeenCalledWith(['tournament-set', 'data']);
      });
    });

    context('when file read fails', function() {
      fileService.readP.resolveWith(undefined);
    }, function() {
      it('should set error', function() {
        expect(stateService.dispatch)
          .toHaveBeenCalledWith(['error-set', 'Invalid file']);
      });
    });
  });

  context('tournamentSetHandler(<data>)', function() {
    return tournamentSetHandler(this.state, ['data']);
  }, function() {
    it('should return <data>', function() {
      expect(this.context).toEqual('data');
    });
  });
});
