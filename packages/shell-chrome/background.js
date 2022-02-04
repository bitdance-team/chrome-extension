// 设置截图方法和存储方法。
chrome.storage.sync.get((config) => {
  chrome.storage.sync.set({method: 'crop'});
  chrome.storage.sync.set({format: 'png'});
  chrome.storage.sync.set({save: 'file'});
  chrome.storage.sync.set({dpr: true});
  if (config.save === 'clipboard') {
    config.save = 'url'
    chrome.storage.sync.set({save: 'url'})
  }
})
  // 定义inject函数，（点击图标就执行）
function inject (tab) {

  chrome.tabs.sendMessage(tab.id, {message: 'init'}, (res) => {
    if (res) {
      // 停止植入css和js文件。
      clearTimeout(timeout)
    }
  })

// 植入css和js文件
  var timeout = setTimeout(() => {
    chrome.tabs.insertCSS(tab.id, {file: 'css/jquery.Jcrop.min.css', runAt: 'document_start'})
    chrome.tabs.insertCSS(tab.id, {file: 'css/content.css', runAt: 'document_start'})
    chrome.tabs.executeScript(tab.id, {file: 'js/jquery.min.js', runAt: 'document_start'})
    chrome.tabs.executeScript(tab.id, {file: 'js/jquery.Jcrop.min.js', runAt: 'document_start'})
    chrome.tabs.executeScript(tab.id, {file: 'js/content.js', runAt: 'document_start'})
    // 间隔发送"init"message
    setTimeout(() => {
      chrome.tabs.sendMessage(tab.id, {message: 'init'})
    }, 100)
  }, 100)
}

// 点击图标后就执行函数inject
chrome.browserAction.onClicked.addListener((tab) => {
  inject(tab)
})
chrome.runtime.onMessage.addListener((req, sender, res) => {
  if (req.message === 'capture') {
    chrome.storage.sync.get((config) => {
      chrome.tabs.getSelected(null, (tab) => {
        chrome.tabs.captureVisibleTab(tab.windowId, {format: config.format}, (image) => {
              crop(image, req.area, req.dpr, config.dpr, config.format, (cropped) => {
                res({message: 'image', image: cropped})
              })
        })
      })
    })
  }
  else if (req.message === 'active') {
    if (req.active) {
          chrome.browserAction.setTitle({tabId: sender.tab.id, title: 'Crop and Save'})
          // chrome.browserAction.setBadgeText({tabId: sender.tab.id, text: '◩'})
    }
    else {
      chrome.browserAction.setTitle({tabId: sender.tab.id, title: 'Screenshot Capture'})
      // chrome.browserAction.setBadgeText({tabId: sender.tab.id, text: ''})
    }
  }
  return true
})

function crop (image, area, dpr, preserve, format, done) {
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
