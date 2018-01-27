$(function() {

  $(".password-form").submit(function() {

    var password = $("input[name='password']").val();
    var confirmation = $("input[name='confirm']").val();

    if (!passwordValid(password)) {
      showErrors(["Password must be at least 6 characters long"]);
      return false;
    }

    if (!passwordConfirmed(password, confirmation)) {
      showErrors(["Password and confirmation did not match"]);
      return false;
    }

    return true;
  });

  function showErrors(errors) {
    setTimeout(function() {
      var errorHtml = $(pug.render('server/views/partials/errors.jade', {
        errors: errors
      }));
      $('#errors').html(errorHtml);
    }, 0);
  }

  function passwordValid(password) {
    return password && password.length > 5;
  }

  function passwordConfirmed(password, confirmation) {
    return password === confirmation;
  }
});
