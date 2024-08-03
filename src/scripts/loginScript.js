/*global chrome*/
(function() {

  let mimicTyping = (string, element) => {
    element.focus();
    for (let i = 0; i < string.length; i++) {
      ['keydown', 'keypress', 'keyup'].forEach(eventType => {
        let event = new KeyboardEvent(eventType, {
          bubbles: true,
          cancelable: true,
          keyCode: string.charCodeAt(i),
          charCode: string.charCodeAt(i),
          key: string[i],
          repeat: false
        });
        element.dispatchEvent(event);
      });

      element.value += string[i];
      let inputEvent = new Event('input', { bubbles: true }); // Triggering this event and setting value of inputs is actually enough for workday. But I want to mimic the entire process.
      element.dispatchEvent(inputEvent);
    }
  }

  let typeLogin = () => {
    let emailEntry = document.getElementById('input-4');
    let passwordEntry = document.getElementById('input-5');
    chrome.runtime.sendMessage({action: "getLoginStorage"})
      .then((response) => {
        mimicTyping(response.email, emailEntry);
        mimicTyping(response.password, passwordEntry);
        // emailEntry.value = response.email; // These can be enabled if you don't want to mimic typing each letter. Just ensure inputEvent is dispatched.
        // passwordEntry.value = response.password

      })
      .catch((error) => {
        console.error('Error receiving response', error)
      })
  };

  typeLogin();

})();

