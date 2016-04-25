const uuid = require('node-uuid');
var expect = require('chai').expect;
var browserReady = require('./shared/browser')();
var browser, pages;

describe('User can setup an account and write a poem', function() {
  var poemName = uuid.v4();
  var testUser1 = 'test-1-' + uuid.v4();
  var testUser2 = 'test-2-' + uuid.v4();

  describe('register a user and logout', function() {
    it('user registers', function() {
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

    it('click logout', function() {
      return pages.logout();
    });
  });

  describe('register a second user', function() {
    it('navigate to register form', function() {
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
    it('click new poem', function() {
      return pages.poems.index.new();
    });

    it('current user is already in poet list', function() {
      expect(pages.poems.new.poet(1)).to.equal(testUser2);
    });

    it('cannot remove the current user from the poet list', function() {
      return pages.poems.new.removePoet(1);
    });

    it('the current user is still in the poet list', function() {
      expect(pages.poems.new.poet(1)).to.equal(testUser2);
    });

    it('add another user to the poet list', function() {
      pages.poems.new.name(poemName);
      return pages.poems.new.addPoet(testUser1);
    });

    it('the other user is now in poet list', function() {
      expect(pages.poems.new.poet(2)).to.equal(testUser1);
    });

    it('remove the other user from the poet list', function() {
      return pages.poems.new.removePoet(2);
    });

    it('the other user is no longer in the poet list', function() {
      expect(pages.poems.new.poet(1)).to.equal(testUser2);
      expect(pages.poems.new.poet(2)).not.to.exist;
    });

    it('add the other user back to the list', function() {
      return pages.poems.new.addPoet(testUser1);
    });

    it('the other user is in the poet list again', function() {
      expect(pages.poems.new.poet(2)).to.equal(testUser1);
    });

    it('start the poem', function() {
      return pages.poems.new.start();
    });
  });

  describe('users write a poem', function() {
    var line = uuid.v4();

    it('should see the poem name', function() {
      expect(pages.poems.edit.name()).to.equal(poemName);
    });

    it('should see the poets', function() {
      expect(pages.poems.edit.poet(1)).to.equal(testUser2);
      expect(pages.poems.edit.poet(2)).to.equal(testUser1);
    });

    it('write a new line', function() {
      return pages.poems.edit.postLine(line);
    });

    it('should show the line in the poem', function() {
      expect(pages.poems.edit.line(1)).to.equal(line);
    });
  });

  describe('users can edit their own lines', function() {
    var line1 = uuid.v4();
    var line2 = uuid.v4();

    it('click the line', function() {
      return pages.poems.edit.editLine(1);
    });

    it('enter new text and submit', function() {
      return pages.poems.edit.postEdit(line1 + 'edit');
    });

    it('should show the updated line', function() {
      expect(pages.poems.edit.line(1)).to.equal(line1 + 'edit');
    });

    it('switch to the first user', function() {
      return pages.logout().then(function() {
        return pages.login.submit(testUser1, testUser1 + 'password');
      });
    });

    it('post another line in the poem', function() {
      return pages.poems.index.select(1).then(function() {
        return pages.poems.edit.postLine(line2);
      });
    });

    it('should show that line in the poem too', function() {
      expect(pages.poems.edit.line(2)).to.equal(line2);
    });

    it('should be able to edit the new line', function() {
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
