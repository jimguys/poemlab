$(function() {
  $("#register").submit(function() {
    var password = $("#password").val();
    if (password !== $("#confirm").val()) {
      return false;
    }
    var hashedPassword = CryptoJS.SHA256(password).toString();
    $("#hashedPassword").val(hashedPassword);
    return true;
  })
});