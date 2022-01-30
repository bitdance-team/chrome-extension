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
 * 将 & < > 等特殊字符转义，但保留中文不进行转义
 *
 * 测试通过: [ re：    百度&nbsp;<>!@#$%%^&*()_+-=[]{}|\:;'",./? ]
 *
 * refer: https://www.javaroad.cn/questions/108186
 * @param string str
 * @returns
 */
var holder = document.createElement('div');
function encodeXML(str) {
  // var holder = document.createElement('div');
  holder.textContent = str;
  return holder.innerHTML;
}

/**
 * refer:
 *
 * omnibox 搜索
 * GitHub demo: https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/mv2-archive/extensions/chrome_search
 * Blog: https://www.cnblogs.com/cc11001100/p/12353361.html
 * Debug: https://chrome.google.com/webstore/detail/omnibox-debug/nhgkpjdgjmjhgjhgjhgjhgjhgjhgjhgjhg
 */

// 支持的搜索方式，第一位保留为默认搜索方式（文字）
var omniboxSearchModes = [
  {
    key: "",
    showText: "文字",
    search: function (text) {
      var url = "https://www.baidu.com/s?wd=" + encodeURIComponent(text);
      navigate(url, newTab = false);
      return {
        status: true,
        result: null
      };
    }
  },
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
      return {
        status: true,
        result: null
      };
    }
  },
  {
    key: "re",
    showText: "网页内正则表达式搜索",
    match: function (text) {
      return /^re( |:|\uff1a)?/.test(text)
    },
    getInputText: function (text, encodeText = true) {
      let returnText = /^re(:| |\uff1a)?(.*)$/.exec(text)[2].trim()
      return encodeText ? encodeXML(returnText) : returnText
    }
  },
  {
    key: "img",
    showText: "图片搜索",
    match: function (text) {
      return /^img( |:|\uff1a)?/.test(text)
    },
    getInputText: function (text, encodeText = true) {
      let returnText = /^img(:| |\uff1a)?(.*)$/.exec(text)[2].trim()
      return encodeText ? encodeXML(returnText) : returnText
    }
  },
  {
    key: "boss",
    showText: "老板键",
    match: function (text) {
      return text.trim() == "boss"
    },
    getInputText: (text) => ""
  }
]

// 当前匹配的搜索模式的下标
var currentSearchModeIndex = 0;

// 当前正在向服务端进行的请求
var currentRequest = null;

// 输入框文本改变事件
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

    // 访问后台完成搜索建议获取（传入搜索文字及回调函数）
    // 获得搜索建议后，执行以下回调函数
    currentRequest = search(text, function (xml) {
      console.log(xml);

      return;

      var results = [];
      var entries = xml.getElementsByTagName("entry");

      for (var i = 0, entry; i < 5 && (entry = entries[i]); i++) {
        var path = entry.getElementsByTagName("file")[0].getAttribute("name");
        var line =
          entry.getElementsByTagName("match")[0].getAttribute("lineNumber");
        var file = path.split("/").pop();

        var description = '<url>' + file + '</url>';
        if (/^file:/.test(text)) {
          description += ' <dim>' + path + '</dim>';
        } else {
          var content = entry.getElementsByTagName("content")[0].textContent;

          // There can be multiple lines. Kill all the ones except the one that
          // contains the first match. We can ocassionally fail to find a single
          // line that matches, so we still handle multiple lines below.
          var matches = content.split(/\n/);
          for (var j = 0, match; match = matches[j]; j++) {
            if (match.indexOf('<b>') > -1) {
              content = match;
              break;
            }
          }

          // Replace any extraneous whitespace to make it look nicer.
          content = content.replace(/[\n\t]/g, ' ');
          content = content.replace(/ {2,}/g, ' ');

          // Codesearch wraps the result in <pre> tags. Remove those if they're
          // still there.
          content = content.replace(/<\/?pre>/g, '');

          // Codesearch highlights the matches with 'b' tags. Replaces those
          // with 'match'.
          content = content.replace(/<(\/)?b>/g, '<$1match>');

          description += ' ' + content;
        }

        results.push({
          content: path + '@' + line,
          description: description
        });
      }

      suggest(results);
    });
  }
);

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
  currentSearchModeIndex = 0; // 初始化搜索方式下标s

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
 * 执行搜索
 * @param {*} query
 * @param {*} callback
 * @returns
 */
function search(query, callback) {
  if (/^re:/.test(query))
    query = query.substring('re:'.length);
  else if (/^file:/.test(query))
    query = 'file:"' + query.substring('file:'.length) + '"';
  else
    query = '"' + query + '"';

  var url = "https://code.google.com/p/chromium/codesearch#search/&type=cs&q=" + query +
    "&exact_package=chromium&type=cs";
  var req = new XMLHttpRequest();
  req.open("GET", url, true);
  req.setRequestHeader("GData-Version", "2");
  req.onreadystatechange = function () {
    if (req.readyState == 4) {
      callback(req.responseXML);
    }
  }
  req.send(null);
  return req;
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
 * 用户输入完成，按下回车键
 */
chrome.omnibox.onInputEntered.addListener(function (text) {
  alert(text)
  navigate("https://www.baidu.com/s?wd=" + text)
  return
  if (/@\d+\b/.test(text)) {
    var chunks = text.split('@');
    var path = chunks[0];
    var line = chunks[1];
    navigate(getUrl(path, line));
  } else if (text == 'halp') {
    // TODO(aa)
  } else {
    navigate("https://code.google.com/p/chromium/codesearch#search/&type=cs" +
      "&q=" + text +
      "&exact_package=chromium&type=cs");
  }
});
