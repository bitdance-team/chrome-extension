
var jcrop, selection
var relativePath = 'assets/html/screenshot'

var overlay = ((active) => (state) => {
  active = typeof state === 'boolean' ? state : state === null ? active : !active
  $('.jcrop-holder')[active ? 'show' : 'hide']()
  chrome.runtime.sendMessage({ message: 'active', senderId: "screenshot", active })
})(false)

var image = (done) => {
  var image = new Image()
  image.id = 'fake-image'
  image.src = chrome.runtime.getURL(relativePath + '/images/pixel.png')
  image.onload = () => {
    $('body').append(image)
    done()
  }
}

var init = (done) => {
  $('#fake-image').Jcrop({
    bgColor: 'none',
    onSelect: (e) => {
      selection = e
      capture()
    },
    onChange: (e) => {
      selection = e
    },
    onRelease: (e) => {
      setTimeout(() => {
        selection = null
      }, 100)
    }
  }, function ready() {
    jcrop = this

    $('.jcrop-hline, .jcrop-vline').css({
      backgroundImage: `url(${chrome.runtime.getURL(relativePath + '/images/Jcrop.gif')})`
    })

    if (selection) {
      jcrop.setSelect([
        selection.x, selection.y,
        selection.x2, selection.y2
      ])
    }

    done && done()
  })
}

var capture = (force) => {
  chrome.storage.sync.get((config) => {
    console.log(config)
    if (selection && (config.method === 'crop' || (config.method === 'wait' && force))) {
      jcrop.release()
      setTimeout(() => {
        console.log("准备capture")
        chrome.runtime.sendMessage({
          message: 'capture', senderId: "screenshot", area: selection, dpr: devicePixelRatio
        }, (res) => {
          console.log("capture回调结果：", res)
          overlay(false)
          selection = null
          save(res.image, config.format, config.save)
        })
      }, 50)
    }
    else if (config.method === 'view') {
      chrome.runtime.sendMessage({
        message: 'capture', senderId: "screenshot",
        area: { x: 0, y: 0, w: innerWidth, h: innerHeight }, dpr: devicePixelRatio
      }, (res) => {
        overlay(false)
        save(res.image, config.format, config.save)
      })
    }
  })
}

var filename = (format) => {
  var pad = (n) => (n = n + '', n.length >= 2 ? n : `0${n}`)
  var ext = (format) => format === 'jpeg' ? 'jpg' : format === 'png' ? 'png' : 'png'
  var timestamp = (now) =>
    [pad(now.getFullYear()), pad(now.getMonth() + 1), pad(now.getDate())].join('-')
    + ' - ' +
    [pad(now.getHours()), pad(now.getMinutes()), pad(now.getSeconds())].join('-')
  return `Screenshot Capture - ${timestamp(new Date())}.${ext(format)}`
}

var save = (image, format, save) => {
  var link = document.createElement('a')
  link.download = filename(format)
  link.href = image
  link.click()

}

window.addEventListener('resize', ((timeout) => () => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    jcrop.destroy()
    init(() => overlay(null))
  }, 100)
})())

chrome.runtime.onMessage.addListener((req, sender, res) => {
  console.log(`进入 assets\html\screenshot\js\content.js 中的onMessage Listener`)
  if (req.senderId !== "screenshot") {
    // 抛给下一个Listener
    res();
  }
  if (req.message === 'init') {
    res({}) // prevent re-injecting

    if (!jcrop) {
      image(() => init(() => {
        overlay()
        capture()
      }))
    }
    else {
      overlay()
      capture(true)
    }
  }
  console.log(`离开 assets\html\screenshot\js\content.js 中的onMessage Listener`)
  return true
})
