chrome.contextMenus.create({
  id: 'bitdance',
  title: '学生助手'
})

// chrome.contextMenus.onClicked.addListener(function (info) {
//     alert('当前菜单信息:'+ JSON.stringify(info))
// })

// 打印消息日志
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("request", request, "path", sender.url.replace(sender.origin, ""), "sender", sender, "sendResponse", sendResponse);
})


//refer: https://github.com/GoogleChrome/chrome-extensions-samples/blob/main/mv2-archive/api/notifications/background.js
function showNotification() {
  var time = /(..)(:..)/.exec(new Date());     // The prettyprinted time.
  var hour = time[1] % 12 || 12;               // The prettyprinted hour.
  var period = time[1] < 12 ? 'a.m.' : 'p.m.'; // The period of the day.
  new Notification(hour + time[2] + ' ' + period, {
    icon: '48.png',
    body: 'Time to make the toast.'
  });
}

chrome.contextMenus.create({
  id: 'bitdance-advanced-search-notification',
  title: 'Notification',
  parentId: 'bitdance',
  onclick: function (info) {
    showNotification()
  }
})
