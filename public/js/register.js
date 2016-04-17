$(function() {

  $("#register").submit(function() {

    var password = $("input[name='password']").val();
    var confirmation = $("input[name='confirm']").val();

    clearErrors();

    if (!passwordValid(password)) {
      addValidationError("Password must be at least 6 characters long");
      return false;
    }

    if (!passwordConfirmed(password, confirmation)) {
      addValidationError("Password and confirmation did not match");
      return false;
    }

    var hashedPassword = CryptoJS.SHA256(password).toString();
    $("input[name='hashedPassword']").val(hashedPassword);
    return true;

  });

  function clearErrors() {
    $("#errors").children().remove();
  }

  function passwordValid(password) {
    return password && password.length > 5;
  }

  function passwordConfirmed(password, confirmation) {
    return password === confirmation;
  }

  function addValidationError(msg) {
    $('<div/>', { class: 'error', text: msg }).appendTo($("#errors"));
  }

});
