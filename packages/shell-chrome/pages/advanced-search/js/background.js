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
    // 搜索建议
    getSuggestions: async function (text) {
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
    search: function (text) {
      navigate("https://www.baidu.com/s?wd=" + encodeURIComponent(text), newTab = false);
    }
  },
  // #############################################################################################################
  {
    key: "yn",
    showText: "网页内搜索",
    match: function (text) {
      return /^yn( |:|\uff1a)?/.test(text)
    },
    getInputText: function (text, encodeText = true) {
      let returnText = /^yn(:| |\uff1a)?(.*)$/.exec(text)[2].trim()
      return encodeText ? encodeXML(returnText) : returnText
    },
    search: function (text) {

    }
  },
  // #############################################################################################################
  {
    key: "re",
    showText: "网页内正则表达式搜索",
    match: function (text) {
      return /^re( |:|\uff1a)?/.test(text)
    },
    getInputText: function (text, encodeText = true) {
      let returnText = /^re(:| |\uff1a)?(.*)$/.exec(text)[2].trim()
      return encodeText ? encodeXML(returnText) : returnText
    },
    search: function (text) {

    }
  },
  // #############################################################################################################
  {
    key: "ls",
    showText: "历史记录搜索",
    match: function (text) {
      return /^ls( |:|\uff1a)?/.test(text)
    },
    getInputText: function (text, encodeText = true) {
      let returnText = /^ls(:| |\uff1a)?(.*)$/.exec(text)[2].trim()
      return encodeText ? encodeXML(returnText) : returnText
    },
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
    showText: "图片搜索",
    match: function (text) {
      return /^img( |:|\uff1a)?/.test(text)
    },
    getInputText: function (text, encodeText = true) {
      let returnText = /^img(:| |\uff1a)?(.*)$/.exec(text)[2].trim()
      return encodeText ? encodeXML(returnText) : returnText
    },
    search: function (text) {

    }
  },
  // #############################################################################################################
  {
    key: "boss",
    showText: "老板键",
    match: function (text) {
      // return text.trim() == "boss"
      return /^boss( |:|\uff1a)?$/.test(text)
    },
    getInputText: (text) => "回车执行"
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
  updateDefaultSuggestion('');
});

/**
 * 搜索框失去焦点
 */
chrome.omnibox.onInputCancelled.addListener(function () {
  updateDefaultSuggestion('');
});

/**
 * 输入框文本改变事件
 */
chrome.omnibox.onInputChanged.addListener(
  function (text, suggest) {

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
    currentSearchMode.getSuggestions(currentSearchMode.getInputText(text));
  }
);

/**
 * 用户输入完成，按下回车键
 */
chrome.omnibox.onInputEntered.addListener(function (text) {
  var searchText = omniboxSearchModes[currentSearchModeIndex].getInputText(text);
  alert(text)
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
    if (!openInNewTab) {
      chrome.tabs.update(tabs[0].id, { url: url });
    } else {
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
      console.log(tabs[0].url)
      return true;
    }
    else {
      console.log(false)
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
  for (var i = 1, keyword; i < omniboxSearchModes.length && (keyword = omniboxSearchModes[i]); i++) {
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
