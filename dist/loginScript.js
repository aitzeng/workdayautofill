let typeEmail = () => {
  let emailEntry = document.getElementById('input-4');
  emailEntry.value = process.env.emailAddress;
}

typeEmail();