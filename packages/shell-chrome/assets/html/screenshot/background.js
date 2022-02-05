// 设置截图方法和存储方法。
chrome.storage.sync.get((config) => {
  chrome.storage.sync.set({ method: 'crop' });
  chrome.storage.sync.set({ format: 'png' });
  chrome.storage.sync.set({ save: 'file' });
  chrome.storage.sync.set({ dpr: true });
  if (config.save === 'clipboard') {
    config.save = 'url'
    chrome.storage.sync.set({ save: 'url' })
  }
})
// 定义inject函数，（点击图标就执行）
function inject(tab) {

  chrome.tabs.sendMessage(tab.id, { message: 'init' }, (res) => {
    if (res) {
      // 停止植入css和js文件。
      clearTimeout(timeout)
    }
  })

  // 植入css和js文件
  var timeout = setTimeout(() => {
    var relativePath = 'assets/html/screenshot/'
    chrome.tabs.insertCSS(tab.id, { file: relativePath + 'css/jquery.Jcrop.min.css', runAt: 'document_start' })
    chrome.tabs.insertCSS(tab.id, { file: relativePath + 'css/content.css', runAt: 'document_start' })
    chrome.tabs.executeScript(tab.id, { file: relativePath + 'js/jquery.min.js', runAt: 'document_start' })
    chrome.tabs.executeScript(tab.id, { file: relativePath + 'js/jquery.Jcrop.min.js', runAt: 'document_start' })
    chrome.tabs.executeScript(tab.id, { file: relativePath + 'js/content.js', runAt: 'document_start' })
    // 间隔发送"init"message
    setTimeout(() => {
      chrome.tabs.sendMessage(tab.id, { message: 'init' })
    }, 100)
  }, 100)
}

var takeScreenshot = inject

chrome.runtime.onMessage.addListener((req, sender, res) => {
  console.log(`进入 assets\html\screenshot\background.js 中的onMessage Listener`)
  if (req.senderId !== "screenshot") {
    // 抛给下一个Listener
    res();
  }
  if (req.message === 'capture') {
    console.log("capture开始")
    chrome.storage.sync.get((config) => {
      chrome.tabs.getSelected(null, (tab) => {
        chrome.tabs.captureVisibleTab(tab.windowId, { format: config.format }, (image) => {
          // 整个网页截图
          // console.log("image", image);
          crop(image, req.area, req.dpr, config.dpr, config.format, (cropped) => {
            // 裁剪后
            // console.log("cropped", cropped)
            console.log("capture结束")
            res({ message: 'image', image: cropped })
            // 回调有问题，参数么有传回去，使用以下变通方式直接转换为可下载的文件
            var link = document.createElement('a'); link.download = "学生助手 屏幕截图 " + Date.now(); link.href = cropped; link.click();
          })
        })
      })
    })
  }
  else if (req.message === 'active') {
    if (req.active) {
      chrome.browserAction.setTitle({ tabId: sender.tab.id, title: 'Crop and Save' })
      // chrome.browserAction.setBadgeText({tabId: sender.tab.id, text: '◩'})
    }
    else {
      chrome.browserAction.setTitle({ tabId: sender.tab.id, title: 'Screenshot Capture' })
      // chrome.browserAction.setBadgeText({tabId: sender.tab.id, text: ''})
    }
  }
  console.log(`离开 assets\html\screenshot\background.js 中的onMessage Listener`)
  return true
})

function crop(image, area, dpr, preserve, format, done) {
  var top = area.y * dpr
  var left = area.x * dpr
  var width = area.w * dpr
  var height = area.h * dpr
  var w = (dpr !== 1 && preserve) ? width : area.w
  var h = (dpr !== 1 && preserve) ? height : area.h

  var canvas = null
  if (!canvas) {
    canvas = document.createElement('canvas')
    document.body.appendChild(canvas)
  }
  canvas.width = w
  canvas.height = h

  var img = new Image()
  img.onload = () => {
    var context = canvas.getContext('2d')
    context.drawImage(img,
      left, top,
      width, height,
      0, 0,
      w, h
    )

    var cropped = canvas.toDataURL(`image/${format}`)
    done(cropped)
  }
  img.src = image
}
