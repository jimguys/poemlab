const uuid = require('node-uuid');
var expect = require('chai').expect;
var browserReady = require('./shared/browser')();
var browser, pages;

describe('User can setup an account and write a poem', function() {
  this.timeout(8000);
  var poemName = uuid.v4();
  var testUser1 = 'test-1-' + uuid.v4();
  var testUser2 = 'test-2-' + uuid.v4();
  var line = uuid.v4();

  describe('register a user and logout', function() {
    it('navigates to registration page', function() {
      return browserReady.then(function(b) {
        browser = b;
        pages = require('./pages')(browser);
        return pages.register.visit();
      });
    });

    it('submit registration form', function() {
      return pages.register.signup({
        username: testUser1,
        email: testUser1 + '@poemlab.com',
        password: testUser1 + 'password'
      });
    });

    it('clicks logout', function() {
      return pages.logout();
    });
  });

  describe('register a second user', function() {
    it('navigates to registration form', function() {
      return pages.register.visit();
    });

    it('submit registration form', function() {
      return pages.register.signup({
        username: testUser2,
        email: testUser2 + '@poemlab.com',
        password: testUser2 + 'password'
      });
    });
  });

  describe('second user creates a poem', function() {
    describe('click new poem', function() {
      before(function() {
        return pages.poems.index.new();
      });

      it('current user is already in poet list', function() {
        expect(pages.poems.new.poet(1)).to.equal(testUser2);
      });

      it('should not be able to remove the current user from the poet list', function() {
        return pages.poems.new.removePoet(1).then(function() {
          expect(pages.poems.new.poet(1)).to.equal(testUser2);
        });
      });
    });

    describe('add another user to the poet list', function() {
      before(function() {
        pages.poems.new.name(poemName);
        return pages.poems.new.addPoet(testUser1);
      });

      it('the other user is now in poet list', function() {
        expect(pages.poems.new.poet(2)).to.equal(testUser1);
      });
    });

    describe('remove the other user from the poet list', function() {
      before(function() {
        return pages.poems.new.removePoet(2);
      });

      it('the other user is no longer in the poet list', function() {
        expect(pages.poems.new.poet(1)).to.equal(testUser2);
        expect(pages.poems.new.poet(2)).not.to.exist;
      });
    });

    describe('add the other user back to the list', function() {
      before(function() {
        return pages.poems.new.addPoet(testUser1);
      });

      it('the other user is in the poet list again', function() {
        expect(pages.poems.new.poet(2)).to.equal(testUser1);
      });
    });

  });

  describe('users write a poem', function() {

    describe('start the poem', function() {
      before(function() {
        return pages.poems.new.start();
      });

      it('should see the poem name', function() {
        expect(pages.poems.edit.name()).to.equal(poemName);
      });

      it('should see the poets', function() {
        expect(pages.poems.edit.poet(1)).to.equal(testUser2);
        expect(pages.poems.edit.poet(2)).to.equal(testUser1);
      });
    });

  });

  describe('write a new line', function() {
    before(function() {
      return pages.poems.edit.postLine(line);
    });

    it('should show the line in the poem', function() {
      expect(pages.poems.edit.line(1)).to.equal(line);
    });
  });

  describe('users can edit their own lines', function() {
    var line1 = uuid.v4();
    var line2 = uuid.v4();

    describe('edit a line', function() {
      before(function() {
        return pages.poems.edit.editLine(1).then(function() {
          return pages.poems.edit.postEdit(line1 + 'edit');
        });
      });

      it('should show the updated line', function() {
        expect(pages.poems.edit.line(1)).to.equal(line1 + 'edit');
      });
    });

    describe('post a line as a different user', function() {
      before(function() {
        return pages.logout().then(function() {
          return pages.login.submit(testUser1, testUser1 + 'password');
        }).then(function() {
          return pages.poems.index.select(1).then(function() {
            return pages.poems.edit.postLine(line2);
          });
        });
      });

      it('should show that line in the poem too', function() {
        expect(pages.poems.edit.line(2)).to.equal(line2);
      });
    });

    describe('edit the new line', function() {
      before(function() {
        return pages.poems.edit.editLine(2).then(function() {
          return pages.poems.edit.postEdit(line2 + 'edit');
        });
      });

      it('should show both of the edited lines', function() {
        expect(pages.poems.edit.line(1)).to.equal(line1 + 'edit');
        expect(pages.poems.edit.line(2)).to.equal(line2 + 'edit');
      });

      it('should not be able to edit the first line, becaues it was posted by the other user', function() {
        return pages.poems.edit.editLine(1).then(function() {
          return pages.poems.edit.assertNotEditing();
        });
      });
    });

  });
});
