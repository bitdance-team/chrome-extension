$(function () {
  console.log("[BitDance extension] 学生助手插件 - 腾讯翻译君自动填入模块加载成功");

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
    if (transText == "") return
    // alert(transText)
    document.getElementsByTagName("textarea")[0].value = decodeURIComponent(transText)
    $(".language-translate-button")[0].click()
  }
})
