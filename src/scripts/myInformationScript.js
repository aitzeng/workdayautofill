/*global chrome*/
(function() {

  let populateWebpage = () => {
    chrome.storage.local.get(["prevEmployed", "country", "firstName", "lastName", "address", "city", "postalCode", "phoneType", "countryCode", "phoneNumber"])
    .then((result) => {
      let selector = result.prevEmployed === 'Yes' ? '[data-uxi-element-id="radio_1"]' : '[data-uxi-element-id="radio_2"]';
      let previousEmployedButton = document.querySelector(selector);

      previousEmployedButton.click();
    })
  }

  populateWebpage();

})();