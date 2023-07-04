function copyEmail() {
  var email = "your-email@example.com";
  var tempInput = document.createElement("input");
  tempInput.value = email;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);
  alert("Email copied to clipboard: " + email);
}
