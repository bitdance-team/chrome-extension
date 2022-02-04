// 注册右键菜单
chrome.contextMenus.create({
  id: 'bitdance-advanced-search',
  title: '高级搜索',
  parentId: 'bitdance',
  onclick: function (info) {
    alert('当前菜单信息:' + JSON.stringify(info))
    alert("[BitDance extension] 学生助手插件 - 高级搜索 已点击菜单")
  }
})



/**
 * ss 的寓意
 *
 * - 搜索 (sou suo)
 *
 * - 超级搜索 (super search)
 * - 智慧搜索 (smart search)
 * - 洞见搜索 (sagacious search)
 * - 流畅搜索 (smooth search)
 * - 安全搜索 (safe search)
 *
 * 当然还有...
 * - 简单搜索 (simple search)
 * - 愚蠢搜索 (stupid search)
 *
 * 即使有上面那么多的功能，但我们不往初心，
 *
 * - 开创探索 (seminal search)
 * - 启航 (set sail)
 */

/**
 * refer:
 *
 * omnibox 搜索
 * GitHub demo: https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/mv2-archive/extensions/chrome_search
 * Blog: https://www.cnblogs.com/cc11001100/p/12353361.html
 * Debug: https://chrome.google.com/webstore/detail/omnibox-debug/nhgkpjdgjmjhgjhgjhgjhgjhgjhgjhgjhg
 */



/**
 * ****************************************************************************************
 *
 * app.js/base.js
 *
 * ****************************************************************************************
 */
//  'use strict';

const app = {};
window.app = app;

/* runtime */
app.runtime = {
  on(e, callback) {
    if (e === 'start') {
      chrome.runtime.onStartup.addListener(callback);
      chrome.runtime.onInstalled.addListener(callback);
    }
  },
  get manifest() {
    return chrome.runtime.getManifest();
  },
  connect(tabId, connectInfo) {
    let port;
    if (typeof tabId === 'object') {
      port = chrome.runtime.connect(tabId);
    }
    else {
      port = chrome.tabs.connect(tabId, connectInfo);
    }
    return {
      on(e, callback) {
        if (e === 'message') {
          port.onMessage.addListener(callback);
        }
      },
      post(msg) {
        port.postMessage(msg);
      }
    };
  }
};

//  /* storage */
//  app.storage = {
//    get(prefs, type = 'managed') {
//      return new Promise(resolve => {
//        if (type === 'managed') {
//          chrome.storage.managed.get(prefs, ps => {
//            chrome.storage.local.get(chrome.runtime.lastError ? prefs : ps || prefs, resolve);
//          });
//        }
//        else {
//          chrome.storage[type].get(prefs, resolve);
//        }
//      });
//    },
//    set(prefs, type = 'managed') {
//      return new Promise(resolve => {
//        chrome.storage[type === 'remote' ? 'remote' : 'local'].set(prefs, resolve);
//      });
//    },
//    on(e, callback) {
//      if (e === 'changed') {
//        chrome.storage.onChanged.addListener(callback);
//      }
//    }
//  };

//  /* button */
//  app.button = {
//    set({
//      popup
//    }, tabId) {
//      if (popup !== undefined) {
//        chrome.browserAction.setPopup({
//          tabId,
//          popup
//        });
//      }
//    },
//    on(e, callback) {
//      if (e === 'clicked') {
//        chrome.browserAction.onClicked.addListener(callback);
//      }
//    }
//  };

// /* tab */
// app.tabs = {
//   open({
//     url
//   }) {
//     return new Promise(resolve => chrome.tabs.create({ url }, resolve));
//   },
//   current() {
//     return new Promise(resolve => chrome.tabs.query({
//       active: true,
//       currentWindow: true
//     }, (tabs = []) => resolve(tabs[0])));
//   },
//   inject: {
//     js(tabId, details) {
//       if (typeof tabId === 'object') {
//         details = tabId;
//         tabId = undefined;
//       }
//       return new Promise((resolve, reject) => {
//         chrome.tabs.executeScript(tabId, Object.assign({
//           runAt: 'document_start'
//         }, details), results => {
//           const lastError = chrome.runtime.lastError;
//           if (lastError) {
//             reject(lastError);
//           }
//           else {
//             resolve(results);
//           }
//         });
//       });
//     },
//     css(tabId, details) {
//       if (typeof tabId === 'object') {
//         details = tabId;
//         tabId = undefined;
//       }
//       return new Promise((resolve, reject) => {
//         chrome.tabs.insertCSS(tabId, Object.assign({
//           runAt: 'document_start'
//         }, details), results => {
//           const lastError = chrome.runtime.lastError;
//           if (lastError) {
//             reject(lastError);
//           }
//           else {
//             resolve(results);
//           }
//         });
//       });
//     }
//   }
// };

//  /* window */
//  app.windows = {
//    open({url, left, top, width, height, type}) {
//      width = width || 700;
//      height = height || 500;
//      if (left === undefined) {
//        left = screen.availLeft + Math.round((screen.availWidth - width) / 2);
//      }
//      if (top === undefined) {
//        top = screen.availTop + Math.round((screen.availHeight - height) / 2);
//      }
//      return new Promise(resolve => chrome.windows.create(
//        {url, width, height, left, top, type: type || 'popup'},
//        resolve
//      ));
//    }
//  };

//  /* menus */
//  app.menus = {
//    add(...items) {
//      for (const item of items) {
//        chrome.contextMenus.create(Object.assign({
//          contexts: item.contexts || ['browser_action']
//        }, item));
//      }
//    },
//    on(e, callback) {
//      if (e === 'clicked') {
//        chrome.contextMenus.onClicked.addListener(callback);
//      }
//    }
//  };



/**
 * ****************************************************************************************
 *
 * 搜索模式配置部分
 *
 * ****************************************************************************************
 */

/**
 * 支持的搜索方式
 *
 * Notes:
 * - 第一位需要保留为默认搜索方式（文字）
 * - getSuggestions / search 方法传入参数应该是经过 getInputText 过滤前面搜索模式字符的字符串
 */
var omniboxSearchModes = [
  // #############################################################################################################
  {
    key: "",
    // 显示文字
    showText: "文字",
    // 搜索模式匹配
    // match: function (text) { },
    // 获取输入文字
    getInputText: function (text, encodeText = true) {
      return encodeText ? encodeXML(text) : text
    },
    // 搜索建议
    getSuggestions: async function (text, suggest) {
      // 如果前面已经有了 【[xx] 】，则先去掉
      text = text.replace(/^\[.*?\]\s*/, "");
      suggest([
        { content: "[百度] " + text, description: "使用 <url>[百度]</url> 搜索 <match>" + text + "</match>", deletable: false },
        { content: "[搜狗] " + text, description: "使用 <url>[搜狗]</url> 搜索 <match>" + text + "</match>", deletable: false },
        { content: "[必应] " + text, description: "使用 <url>[必应]</url> 搜索 <match>" + text + "</match>", deletable: false },
        { content: "[360] " + text, description: "使用 <url>[360]</url> 搜索 <match>" + text + "</match>", deletable: false },
        { content: "[微博] " + text, description: "使用 <url>[微博]</url> 搜索 <match>" + text + "</match>", deletable: false },
        { content: "[中国搜索] " + text, description: "使用 <url>[中国搜索]</url> 搜索 <match>" + text + "</match>", deletable: false },
      ]);
      return;

      var url = "https://code.google.com/p/chromium/codesearch#search/&type=cs&q=" + query +
        "&exact_package=chromium&type=cs";
      var req = new XMLHttpRequest();
      req.open("GET", url, true);
      req.setRequestHeader("GData-Version", "2");
      req.onreadystatechange = function () {
        if (req.readyState == 4) callback(req.responseXML);
      }
      req.send(null);
      // return req;


      suggestions.forEach((suggestion) => { suggestion.deletable = false /* 用户不可删除 */ });
      /**
       * SuggestResult
       * refer: https://developer.chrome.com/docs/extensions/reference/omnibox/
       * { content, description[, deletable] }
       */
      suggest(suggestions);

      // suggest([
      //   { content: "one", description: "the <match>aaa</match><url>www</url>first one", deletable: false },
      //   { content: "number two", description: "the second entry", deletable: false }
      // ]);
    },
    // 执行搜索
    search: function (text) {
      let searchInput = /^(\[.*?\])?( )?(.*)$/.exec(text)
      let searchType = /^\[(.*?)\]$/.exec((searchInput[1] ?? "[百度]"/* 默认百度搜索 */).trim())[0].trim()
      let searchText = searchInput[3].trim()
      console.log("[文字搜索开始]");
      console.log("    传入参数为：", text);
      console.log("    searchInput为：", searchInput);
      console.log("    searchType为：", searchType);
      console.log("    searchText为：", searchText);
      switch (searchType) {
        default:
        case "[百度]":
          navigate("https://www.baidu.com/s?wd="+ encodeURIComponent(searchText), true);
          break;
        case "[搜狗]":
          navigate("https://www.sogou.com/web?query="+ encodeURIComponent(searchText), true);
          break;
        case "[必应]":
          navigate("https://cn.bing.com/search?q="+ encodeURIComponent(searchText), true);
          break;
        case "[360]":
          navigate("https://www.so.com/s?q="+ encodeURIComponent(searchText), true);
          break;
        case "[微博]":
          navigate("https://s.weibo.com/weibo?q="+ encodeURIComponent(searchText), true);
          break;
        case "[中国搜索]":
          navigate("http://www.chinaso.com/newssearch/all/allResults?q=" + encodeURIComponent(searchText), true);
          break;
      }
      console.log("[文字搜索结束]");
    }
  },
  // #############################################################################################################
  {
    key: "yn",
    // 显示文字
    showText: "网页内搜索(Todo)",
    // 搜索模式匹配
    match: function (text) {
      return /^yn( |:|\uff1a)?/.test(text)
    },
    // 获取输入文字
    getInputText: function (text, encodeText = true) {
      let returnText = /^yn(:| |\uff1a)?(.*)$/.exec(text)[2].trim()
      return encodeText ? encodeXML(returnText) : returnText
    },
    // 搜索建议
    getSuggestions: async function (text, suggest) {
      return;
    },
    // 执行搜索
    search: function (text) {

    }
  },
  // #############################################################################################################
  {
    key: "re",
    // 显示文字
    showText: "网页内正则表达式搜索(Todo)",
    // 搜索模式匹配
    match: function (text) {
      return /^re( |:|\uff1a)?/.test(text)
    },
    // 获取输入文字
    getInputText: function (text, encodeText = true) {
      let returnText = /^re(:| |\uff1a)?(.*)$/.exec(text)[2].trim()
      return encodeText ? encodeXML(returnText) : returnText
    },
    // 搜索建议
    getSuggestions: async function (text, suggest) {
      return;
    },
    // 执行搜索
    search: function (text) {

    }
  },
  // #############################################################################################################
  {
    key: "ls",
    // 显示文字
    showText: "历史记录搜索",
    // 搜索模式匹配
    match: function (text) {
      return /^ls( |:|\uff1a)?/.test(text)
    },
    // 获取输入文字
    getInputText: function (text, encodeText = true) {
      let returnText = /^ls(:| |\uff1a)?(.*)$/.exec(text)[2].trim()
      return encodeText ? encodeXML(returnText) : returnText
    },
    // 搜索建议
    getSuggestions: async function (text, suggest) {
      return;
    },
    // 执行搜索
    search: function (text) {
      function onGot(historyItems) {
        for (item of historyItems) {
          console.log(item.url);
          console.log(new Date(item.lastVisitTime));
        }
      }

      var searching = browser.history.search({ text: text, startTime: 0 });

      searching.then(onGot);
    }
  },
  // #############################################################################################################
  {
    key: "img",
    // 显示文字
    showText: "图片搜索",
    // 搜索模式匹配
    match: function (text) {
      return /^img( |:|\uff1a)?/.test(text)
    },
    // 获取输入文字
    getInputText: function (text, encodeText = true) {
      let returnText = /^img(:| |\uff1a)?(.*)$/.exec(text)[2].trim()
      return encodeText ? encodeXML(returnText) : returnText
    },
    // 搜索建议
    getSuggestions: async function (text, suggest) {
      // 如果前面已经有了 【[xx] 】，则先去掉
      text = text.replace(/^\[.*?\]\s*/, "");
      suggest([
        { content: "img: [百度] " + text, description: "使用 <url>[百度图片]</url> 搜索 <match>" + text + "</match>", deletable: false },
        { content: "img: [搜狗] " + text, description: "使用 <url>[搜狗图片]</url> 搜索 <match>" + text + "</match>", deletable: false },
        { content: "img: [必应] " + text, description: "使用 <url>[必应图片]</url> 搜索 <match>" + text + "</match>", deletable: false },
        { content: "img: [360] " + text, description: "使用 <url>[360图片]</url> 搜索 <match>" + text + "</match>", deletable: false },
        { content: "img: [微博] " + text, description: "使用 <url>[微博图片]</url> 搜索 <match>" + text + "</match>", deletable: false },
        { content: "img: [中国搜索] " + text, description: "使用 <url>[中国搜索图片]</url> 搜索 <match>" + text + "</match>", deletable: false },
      ]);
      return;
    },
    // 执行搜索
    search: function (text) {
      let searchInput = /^(\[.*?\])?( )?(.*)$/.exec(text)
      let searchType = /^\[(.*?)\]$/.exec((searchInput[1] ?? "[百度]"/* 默认百度图片搜索 */).trim())[0].trim()
      let searchText = searchInput[3].trim()
      console.log("[图片搜索开始]");
      console.log("    传入参数为：", text);
      console.log("    searchInput为：", searchInput);
      console.log("    searchType为：", searchType);
      console.log("    searchText为：", searchText);
      switch (searchType) {
        default:
        case "[百度]":
          navigate("https://image.baidu.com/search/index?tn=baiduimage&word=" + encodeURIComponent(searchText), true);
          break;
        case "[搜狗]":
          navigate("https://pic.sogou.com/pics?query=" + encodeURIComponent(searchText), true);
          break;
        case "[必应]":
          navigate("https://cn.bing.com/images/search?q=" + encodeURIComponent(searchText), true);
          break;
        case "[360]":
          navigate("https://image.so.com/i?q=" + encodeURIComponent(searchText), true);
          break;
        case "[微博]":
          navigate("https://s.weibo.com/pic?q=" + encodeURIComponent(searchText), true);
          break;
        case "[中国搜索]":
          navigate("http://www.chinaso.com/newssearch/image?q=" + encodeURIComponent(searchText), true);
          break;

      }
      console.log("[图片搜索结束]");
    }
  },
  // #############################################################################################################
  // Todo: 视频搜索
  // {
  //   key: "video",
  //   // 显示文字
  //   showText: "视频搜索",
  //   // 搜索模式匹配
  //   match: function (text) {
  //     return /^video( |:|\uff1a)?/.test(text)
  //   },
  //   // 获取输入文字
  //   getInputText: function (text, encodeText = true) {
  //     let returnText = /^video(:| |\uff1a)?(.*)$/.exec(text)[2].trim()
  //     return encodeText ? encodeXML(returnText) : returnText
  //   },
  //   // 搜索建议
  //   getSuggestions: async function (text, suggest) {
  //     // 如果前面已经有了 【[xx] 】，则先去掉
  //     text = text.replace(/^\[.*?\]\s*/, "");
  //     suggest([
  //       { content: "video: [百度] " + text, description: "使用 <url>[百度视频]</url> 搜索 <match>" + text + "</match>", deletable: false },
  //       { content: "video: [搜狗] " + text, description: "使用 <url>[搜狗视频]</url> 搜索 <match>" + text + "</match>", deletable: false },
  //       { content: "video: [必应] " + text, description: "使用 <url>[必应视频]</url> 搜索 <match>" + text + "</match>", deletable: false },
  //       { content: "video: [360] " + text, description: "使用 <url>[360视频]</url> 搜索 <match>" + text + "</match>", deletable: false },
  //       { content: "video: [微博] " + text, description: "使用 <url>[微博视频]</url> 搜索 <match>" + text + "</match>", deletable: false },
  //       { content: "video: [中国搜索] " + text, description: "使用 <url>[中国搜索视频]</url> 搜索 <match>" + text + "</match>", deletable: false },
  //     ]);
  //     return;
  //   },
  //   // 执行搜索
  //   search: function (text) {
  //     let searchInput = /^(\[.*?\])?( )?(.*)$/.exec(text)
  //     let searchType = /^\[(.*?)\]$/.exec((searchInput[1] ?? "[百度]"/* 默认百度视频搜索 */).trim())[0].trim()
  //     let searchText = searchInput[3].trim()
  //     console.log("[视频搜索开始]");
  //     console.log("    传入参数为：", text);
  //     console.log("    searchInput为：", searchInput);
  //     console.log("    searchType为：", searchType);
  //     console.log("    searchText为：", searchText);
  //     switch (searchType) {
  //       default:
  //       case "[百度]":
  //         navigate("https://v.baidu.com/v?word=" + encodeURIComponent(searchText), true);
  //         break;
  //       case "[搜狗]":
  //         navigate("https://pic.sogou.com/pics?query=" + encodeURIComponent(searchText), true);
  //         break;
  //       case "[必应]":
  //         navigate("https://cn.bing.com/images/search?q=" + encodeURIComponent(searchText), true);
  //         break;
  //       case "[360]":
  //         navigate("https://image.so.com/i?q=" + encodeURIComponent(searchText), true);
  //         break;
  //       case "[微博]":
  //         navigate("https://s.weibo.com/pic?q=" + encodeURIComponent(searchText), true);
  //         break;
  //       case "[中国搜索]":
  //         navigate("http://www.chinaso.com/newssearch/image?q=" + encodeURIComponent(searchText), true);
  //         break;

  //     }
  //     console.log("[图片搜索结束]");
  //   }
  // },
  // #############################################################################################################
  {
    key: "boss",
    // 显示文字
    showText: "召唤“学生助手”",
    // 搜索模式匹配
    match: function (text) {
      // return text.trim() == "boss"
      return /^boss( |:|\uff1a)?$/.test(text)
    },
    // 获取输入文字
    getInputText: (text) => "回车执行",
    // 搜索建议
    getSuggestions: async function (text, suggest) {
      return;
    },
    // 执行搜索
    search: function (text) {

    }
  }
]



/**
 * ****************************************************************************************
 *
 * 全局变量定义部分
 *
 * ****************************************************************************************
 */
// 当前匹配的搜索模式的下标
var currentSearchModeIndex = 0;

// 当前正在向服务端进行的请求
var currentRequest = null;

//
var ajaxUrl = "https://www.baidu.com/s?wd=";



/**
 * ****************************************************************************************
 *
 * 搜索模式配置部分
 *
 * ****************************************************************************************
 */

/**
 * 用户开始输入文本
 */
chrome.omnibox.onInputStarted.addListener(function () {
  console.log("chrome.omnibox.onInputStarted");
  updateDefaultSuggestion('');
});

/**
 * 搜索框失去焦点
 */
chrome.omnibox.onInputCancelled.addListener(function () {
  console.log("chrome.omnibox.onInputCancelled");
  updateDefaultSuggestion('');
});

/**
 * 输入框文本改变事件
 */
chrome.omnibox.onInputChanged.addListener(function (text, suggest) {
  console.log("chrome.omnibox.onInputChanged", text);

  // 停止上一次搜索行为
  if (currentRequest != null) {
    currentRequest.onreadystatechange = null;
    currentRequest.abort();
    currentRequest = null;
  }

  // 更新输入框回显提示信息
  updateDefaultSuggestion(text);

  // 如果啥也没有输入就返回
  if (text.trim() == '')
    return;

  // 访问后端服务获得搜索建议
  var currentSearchMode = omniboxSearchModes[currentSearchModeIndex];
  currentSearchMode.getSuggestions(currentSearchMode.getInputText(text), suggest);
});

/**
 * 用户输入完成，按下回车键
 */
chrome.omnibox.onInputEntered.addListener(function (text) {
  console.log("chrome.omnibox.onInputEntered");

  // 更新输入框回显提示信息
  // 注意：这里必须还要更新一次，因为用户在输入时使用上下键选择suggest项目时，会触发 chrome.omnibox.onInputChanged 事件
  //       如果不执行，那么输入 ss img 之后上下选择对应搜索，按回车会被解析为文字搜索，而不是图片搜索
  updateDefaultSuggestion(text);

  var searchMode = omniboxSearchModes[currentSearchModeIndex];
  var searchText = searchMode.getInputText(text);
  searchMode.search(searchText);
  console.log("用户输入：" + text);
});



/**
 * ****************************************************************************************
 *
 * 公共函数部分
 *
 * ****************************************************************************************
 */

/**
 * 将 & < > 等特殊字符转义，但保留中文不进行转义
 *
 * 测试通过: [ re：    百度&nbsp;<>!@#$%%^&*()_+-=[]{}|\:;'",./? ]
 *
 * refer: https://www.javaroad.cn/questions/108186
 * @param string str
 * @returns
 */
function encodeXML(str) {
  var holder = document.createElement('div');
  holder.textContent = str;
  return holder.innerHTML;
}


/**
 * 将当前标签页导航到指定Url / 或者新建标签页
 *
 * @param String url 要导航到的url
 * @param bool openInNewTab 是否打开新标签页
 */
function navigate(url, openInNewTab = false) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (!openInNewTab || isCurrentNewTab()) {
      // 如果不在新标签页打开，或者当前标签页是新标签页
      chrome.tabs.update(tabs[0].id, { url: url });
    } else {
      // 如果在新标签页打开，且当前标签页不是新标签页
      chrome.tabs.create({ url: url });
    }
  });
}



/**
 * 获取当前是否是新标签页
 */
function isCurrentNewTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs && tabs.length > 0 && !!tabs[0].url && /^(.*?):\/\/newtab\/$/.test(tabs[0].url)) {
      console.log("当前标签页是新标签页");
      return true;
    }
    else {
      console.log("当前标签页不是新标签页");
      return false;
    }
  });
}



/**
 * 更新下拉框中提示
 * @param String text 用户输入文本
 */
function updateDefaultSuggestion(text) {

  var description = [
    '<match><url>搜索方式</url></match>',
    '<dim> [ </dim>',
    '' /* 文字搜索 显示文字占位 */
  ];

  // 如果用户输入不为空，先假设为文字搜索，如果后面匹配上了其他搜索方式，则更新
  let isPlaintext = !!text.trim().length;
  currentSearchModeIndex = 0; // 初始化搜索方式下标

  // 默认第 0 个为文字搜索，除此之外的搜索方式如果都没有匹配到，则显示文字搜索
  for (var i = 1, keyword; i < omniboxSearchModes.length; i++) {
    keyword = omniboxSearchModes[i];

    // 分隔符
    description.push('<dim> \| </dim>');

    // 通过用户输入文本匹配搜索方式
    if (keyword.match(text)) {
      // 是当前这种搜索模式
      isPlaintext = false; // 说明不是文字搜索
      currentSearchModeIndex = i; // 记录当前搜索模式的下标
      description.push('<match>' + keyword.showText + '：' + keyword.getInputText(text) + '</match>');
    } else {
      // 不是当前这种搜索模式
      description.push('<dim>' + keyword.key + ": " + keyword.showText + '</dim>');
    }
  }
  description.push('<dim> ] </dim>');

  description[2] = isPlaintext ? ('<match>' + text.trim() + '</match>') : ('<dim>' + omniboxSearchModes[0].showText + '</dim>');

  console.log("[更新下拉框提示开始]");
  console.log("    text：", text);
  console.log("    当前匹配搜索模式：", omniboxSearchModes[currentSearchModeIndex].showText);
  console.log("    isPlaintext：", isPlaintext);
  // console.log(description.join(''));
  console.log("[更新下拉框提示结束]");

  chrome.omnibox.setDefaultSuggestion({
    description: description.join('')
  });

  // var isRegex = /^re:/.test(text);
  // var isFile = /^file:/.test(text);
  // var isHalp = (text == 'halp');
  // var isPlaintext = text.length && !isRegex && !isFile && !isHalp;

  // var description = '<match><url>搜索方式</url></match><dim> [ </dim>';
  // description += isPlaintext ? ('<match>' + text + '</match>') : '文字';
  // description += '<dim> | </dim>';
  // description += isRegex ? ('<match>' + text + '</match>') : 're: 正则';
  // description += '<dim> | </dim>';
  // description += isFile ? ('<match>' + text + '</match>') : 'file:文件';
  // description += '<dim> | </dim>';
  // description += isHalp ? '<match>halp</match>' : 'halp';
  // description += '<dim> ]</dim>';

  // chrome.omnibox.setDefaultSuggestion({
  //   description: description
  // });
}


// /**
//  * 执行搜索
//  * @param {*} query
//  * @param {*} callback
//  * @returns
//  */
// function search(query, callback) {

//   var url = "https://code.google.com/p/chromium/codesearch#search/&type=cs&q=" + query +
//     "&exact_package=chromium&type=cs";
//   var req = new XMLHttpRequest();
//   req.open("GET", url, true);
//   req.setRequestHeader("GData-Version", "2");
//   req.onreadystatechange = function () {
//     if (req.readyState == 4) {
//       callback(req.responseXML);
//     }
//   }
//   req.send(null);
//   return req;
// }


/**
 * ****************************************************************************************
 *
 * 测试代码及其他
 *
 * ****************************************************************************************
 */

/*
先抛砖。未来在 Chrome 中输入：Chrome 过去1年最重要的变化？ 知乎(或者zh)我们将带你进入问题页面，如果没有类似问题，就会直接提问。这个东西带来的想象力是，你可以用浏览器简单快捷的做不少事情，比如发微博，就输入「wb 知乎很给力」，京东购物，就输入「jd买 iPhone 4」。但很可能是一个相对小众的工具。

作者：李申申
链接：https://www.zhihu.com/question/19565733/answer/12236808
来源：知乎
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
 */
