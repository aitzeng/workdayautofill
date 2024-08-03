/*global chrome*/
// let decryptData = async (key, encryptedData) => {
//   let result = await new Promise((resolve, reject) => {
//     chrome.storage.session.get(['iv'], (items) => {
//       if (chrome.runtime.lastError) {
//         reject(chrome.runtime.lastError);
//       } else {
//         resolve(new Uint8Array(items.iv));
//       }
//     });
//   });

//   let ivArray = new Uint8Array(result);
//   let decryptedData = await window.crypto.subtle.decrypt({
//     name: "AES-GCM", iv: ivArray
//   }, key, new Uint8Array(encryptedData));

//   return new TextDecoder().decode(decryptedData);
// };


// let typeLogin = () => {
//   let emailEntry = document.getElementById('input-4');
//   let passwordEntry = document.getElementById('input-5');
//   chrome.runtime.sendMessage({action: "getLoginStorage"})
//     .then((response) => {
//       emailEntry.value = response.email;
//       passwordEntry.value = response.password
//     })
//     .catch((error) => {
//       console.error('Error receiving response', error)
//     })
// };

// typeLogin();
console.log('This loginScript is good')