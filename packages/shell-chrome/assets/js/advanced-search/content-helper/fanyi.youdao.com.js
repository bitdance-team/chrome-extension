console.log("[BitDance extension] 学生助手插件 - 有道翻译自动填入模块加载成功");

// refer: https://www.cnblogs.com/chen-lhx/p/5198612.html
$.extend({
  getUrlVars: function () {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  },
  getUrlVar: function (name) {
    return $.getUrlVars()[name];
  }
});

window.onload = () => {
  let transText = $.getUrlVar('__bitdance_extension__');
  if (!transText || transText.trim() == "") return
  console.log("[BitDance extension] 学生助手插件 - 有道翻译自动填入模块 - 翻译文本为：", transText);

  document.getElementsByTagName("textarea")[0].value = decodeURIComponent(transText)
  document.getElementById("transMachine").click()

  // 参数获取完成后，清除掉页面参数
  // History.replaceState()  refer: https://developer.mozilla.org/zh-CN/docs/Web/API/History/replaceState
  history.replaceState({}, "", "/");
}
