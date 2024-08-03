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
  let decryptedData = await crypto.subtle.decrypt({
    name: "AES-GCM", iv: ivArray
  }, key, new Uint8Array(encryptedData));

  return new TextDecoder().decode(decryptedData);
};


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getLoginStorage") {
    chrome.storage.session.get(['email', 'password', 'encryptionKey'], async (result) => {
      try {
        const encryptedDataArray = new Uint8Array(result.password);
        // console.log('Length of key:', new Uint8Array(result.key).length)
        const key = await crypto.subtle.importKey(
          "raw",
          new Uint8Array(result.encryptionKey),
          { name: "AES-GCM" },
          false,
          ["decrypt"]
        );

        decryptData(key, encryptedDataArray)
          .then((decryptedPassword) => {
            sendResponse({'email': result.email, 'password': decryptedPassword});
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