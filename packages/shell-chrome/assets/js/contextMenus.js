// 注册右键菜单
chrome.contextMenus.create({
  id: 'bitdance',
  title: '学生助手'
})

chrome.contextMenus.create({
  parentId: 'bitdance',
  id: 'bitdance-advanced-search',
  title: '高级搜索（Todo）'
})

chrome.contextMenus.create({
  parentId: 'bitdance',
  id: 'bitdance-advanced-search-notification',
  title: 'Notification',
})

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  console.log("info", info, "tab", tab)
  //   alert('当前菜单信息:' + JSON.stringify(info))

  switch (info.menuItemId) {
    case "bitdance-advanced-search-notification":
      // 测试Notification
      showNotification()
      break;
    case "bitdance-advanced-search":
      // 高级搜索
      console.log("[BitDance extension] 学生助手插件 - 高级搜索 已点击菜单")
      break;
  }
})



//refer: https://github.com/GoogleChrome/chrome-extensions-samples/blob/main/mv2-archive/api/notifications/background.js
function showNotification() {
  // var time = /(..)(:..)/.exec(new Date());     // The prettyprinted time.
  // var hour = time[1] % 12 || 12;               // The prettyprinted hour.
  // var period = time[1] < 12 ? 'a.m.' : 'p.m.'; // The period of the day.
  // new Notification(hour + time[2] + ' ' + period, {
  //   icon: '48.png',
  //   body: 'Time to make the toast.'
  // });

  // refer: https://developer.chrome.com/docs/extensions/mv3/richNotifications/#develop
  chrome.notifications.create('', {
    type: 'basic',
    iconUrl: 'assets/image/logo.png',
    title: '学生助手',
    message: 'Time to make the toast.'
  }, function (notificationId) {
    console.log('notificationId: ' + notificationId)
  })
}
