// 翻译功能
function showTranslationWindow() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.executeScript(tabs[0].id, { file: './assets/js/translate/tran.js', runAt: 'document_start' })
    chrome.tabs.insertCSS(tabs[0].id, { file: './assets/css/tran.css', runAt: 'document_start' })
  })
}
