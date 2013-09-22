$(function() {
  $("#login").submit(function() {
    var password = $("#password").val();
    var hashedPassword = CryptoJS.SHA256(password).toString();
    $("#hashedPassword").val(hashedPassword);
    return true;
  })
});