console.log("[BitDance extension] 学生助手插件 - 自动搜索模块加载成功");

// refer: https://www.cnblogs.com/chen-lhx/p/5198612.html
// $.extend({
//   getUrlVars: function () {
//     var vars = [], hash;
//     var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
//     for (var i = 0; i < hashes.length; i++) {
//       hash = hashes[i].split('=');
//       vars.push(hash[0]);
//       vars[hash[0]] = hash[1];
//     }
//     return vars;
//   },
//   getUrlVar: function (name) {
//     return $.getUrlVars()[name];
//   }
// });
// let transText = $.getUrlVar('__bitdance_extension__');

window.onload = () => {

  /**
   * 先处理不需要传入参数，只需要点击按钮的情况，然后再处理需要传入参数的情况
   */

  /**
   * **********************************************************************************************
   *
   *  不需要传入参数情况
   *
   * **********************************************************************************************
   */
  switch (window.location.host) {

    case "fanyi.qq.com": // 腾讯翻译君
      document.getElementsByClassName("language-translate-button")[0].click()
      // $(".language-translate-button")[0].click()
      clearUrlParams();
      return;

  }

  /**
   * **********************************************************************************************
   *
   *  需要传入参数的情况
   *
   * **********************************************************************************************
   */

  /**
   * 定义函数
   */
  // 获取 URL 参数
  function getUrlVar(name) {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return decodeURIComponent(vars[name] ?? "");
  }

  // 从URL参数中剔除指定参数
  function clearUrlParams() {
    // 参数获取完成后，清除页面参数
    // History.replaceState()  refer: https://developer.mozilla.org/zh-CN/docs/Web/API/History/replaceState
    // history.replaceState({}, "", "/");
    let urlParams = (location.search + "&").replace(/__bitdance_extension__=.*?\&/, ""); // 在最后补上一个 & ，然后替换掉 __bitdance_extension__=xxx&
    urlParams = urlParams.substring(0, urlParams.length - 1); // 去掉最后一个 &
    history.replaceState({}, "", location.pathname + urlParams);
  }

  /**
   * 开始代码逻辑
   */
  // 获取参数
  let transText = getUrlVar('__bitdance_extension__')

  console.log(transText);

  // 如果没有传递参数，那么就不执行
  if (!transText || transText.trim() == "" || transText == "undefined")
    return

  switch (window.location.host) {
    default:
      break;

    case "baike.baidu.com": // 百度百科
      document.getElementById("query").value = transText
      document.getElementById("search").click()
      // 跳转新页面，所以不需要清除页面参数
      break;

    case "fanyi.youdao.com": // 有道翻译
      document.getElementsByTagName("textarea")[0].value = transText
      document.getElementById("transMachine").click()
      clearUrlParams();
      break;

    case "www.cnki.net": // 中国知网
      document.getElementById("txt_SearchText").value = transText
      document.querySelector(".search-btn").click()
      break;

    case "qikan.cqvip.com": // 维普期刊
      document.getElementById("searchKeywords").value = transText
      document.getElementById("btnSearch").click()
      break;

  }

  console.log("[BitDance extension] 学生助手插件 - 自动搜索模块完成搜索 [" + transText + "]");
}
