chrome.runtime.onInstalled.addListener(() => {
  console.log("Auto Fill Extension installed");
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "AUTO_FILL") {
    console.log("Received AUTO_FILL message", message);
  }
});
