// console.log("[BitDance extension] 学生助手插件 - 删除谷歌广告模块加载成功");
// window.onload = () => {

//   // 基本上 background_preventAdsScript.js 可以在源头拦截所有广告，所以下面的代码正常情况可以不用，除非用户未授权所需权限

//   // 谷歌广告的通用特性是几层ins中间包含iframe，最外层ins有adsbygoogle这个class，所以上来就给他干掉
//   var insList = document.getElementsByTagName("ins");
//   for (var i = insList.length - 1; i >= 0; i--) {
//     ins = insList[i];
//     if (ins.classList.contains("adsbygoogle")) {
//       console.log("发现google广告ins容器，删除！");
//       ins.parentNode.removeChild(ins);
//     }
//   }

//   // 如果不含ins，但是能够断定是广告iframe，也干掉他
//   var iframes = document.getElementsByTagName("iframe");
//   for (var i = iframes.length - 1; i >= 0; i--) {
//     if (iframes[i].src.indexOf("googleads.g.doubleclick.net") > -1) {
//       console.log("发现google广告，删除！");
//       iframes[i].parentNode.removeChild(iframes[i]);
//     }
//   }
// }
