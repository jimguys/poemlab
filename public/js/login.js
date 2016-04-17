$(function() {
  $("#login").submit(function() {
    var password = $("input[name='password']").val();
    var hashedPassword = CryptoJS.SHA256(password).toString();
    $("input[name='hashedPassword']").val(hashedPassword);
    return true;
  });
});
