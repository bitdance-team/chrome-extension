console.log("[BitDance extension] 学生助手插件 - 中国知网自动搜索模块加载成功");

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
  transText = decodeURIComponent(transText)
  console.log("[BitDance extension] 学生助手插件 - 中国知网自动搜索模块 - 模块文本为：", transText);

  document.getElementById("txt_SearchText").value = transText
  document.querySelector(".search-btn").click()
}
