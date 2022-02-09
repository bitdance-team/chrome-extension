console.log("[BitDance extension] 学生助手插件已启用")

// 每次改变开关状态时刷新页面使功能及时生效
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(`进入 assets\js\content.js 中的onMessage Listener`)

  if (request.action === 'refreshPage') {
    location.reload();
    sendResponse('Reload page because of ' + request.info);
  }

  console.log(`离开 assets\js\content.js 中的onMessage Listener`)
  return true;
})
