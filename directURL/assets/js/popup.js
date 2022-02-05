const btn = document.querySelector("#switch");
 
chrome.storage.sync.get("linkOpen", ({ linkOpen }) => {
  btn.checked = linkOpen;
});
 
btn.addEventListener("change", () => {
  if (btn.checked) {
    chrome.storage.sync.set({ linkOpen: true });
  } else {
    chrome.storage.sync.set({ linkOpen: false });
  }
  // 获取当前tab窗口
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: refreshPage,
    });
  });
});
 
// 刷新页面
function refreshPage() {
  window.location.reload();
}