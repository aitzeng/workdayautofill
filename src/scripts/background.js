/*global chrome*/

let decryptData = async (key, encryptedData) => {
  let result = await new Promise((resolve, reject) => {
    chrome.storage.session.get(['iv'], (items) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(new Uint8Array(items.iv));
      }
    });
  });

  let ivArray = new Uint8Array(result);
  let decryptedData = await window.crypto.subtle.decrypt({
    name: "AES-GCM", iv: ivArray
  }, key, new Uint8Array(encryptedData));

  return new TextDecoder().decode(decryptedData);
};


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getLoginStorage") {
    chrome.storage.session.get(['email', 'password', 'key'], async (result) => {
      try {
        const key = await window.crypto.subtle.importKey(
          "raw",
          new Uint8Array(result.key),
          { name: "AES-GCM", length: 256 },
          false,
          ["decrypt"]
        );

        decryptData(key, result.password)
          .then((decryptedPassword) => {
            sendResponse({'email': result.email, 'password': decryptedPassword})
          })
          .catch(error => {
            console.error('Decryption failed:', error);
            sendResponse({error: 'Decryption failed'});
          });
      } catch (error) {
        console.error('Key import failed:', error);
        sendResponse({error: 'Key import failed'});
      }
    });
    return true;
  }
});
