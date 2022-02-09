var AdsBlockStatus = true;
// refer: https://www.it1352.com/1996113.html
chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    console.log("AdsBlock Status: ", AdsBlockStatus);

    if (!AdsBlockStatus)
      return { cancel: false }; // 如果没有开启此功能，不处理

    if (!details || !details.initiator || !details.url)
      return { cancel: false }; // 如果没有请求信息，则可能是chrome://开头的页面，不处理

    let isBlock = false
      || details.initiator === "https://googleads.g.doubleclick.net"
      || details.initiator.indexOf("googleads.g.doubleclick.net") != -1
      || details.url.indexOf("googleads.g.doubleclick.net") != -1
      || details.url.indexOf("pagead2.googlesyndication.com") != -1
      || details.url.indexOf("pagead2.googlesyndication.com") != -1
      || details.url.indexOf("partner.googleadservices.com") != -1
      || details.url.indexOf("adservice.google.com") != -1
      || details.url.indexOf("googleads") != -1
      || details.url.indexOf("adsbygoogle") != -1

    if (isBlock) // 拦截后打印到控制台显示
      console.log(isBlock ? "block" : "allow", details)

    return { cancel: isBlock };
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);

// 由于上方拦截函数不可以是异步函数，所以设置变更后需要及时调用此函数
var updateAdsBlockStatus = (status) => {
  AdsBlockStatus = !!status;
}

// 插件刚开始加载时，先读取一次状态
chrome.storage.sync.get('State_AdsBlock', function (State) {
  updateAdsBlockStatus(State.State_AdsBlock);
});
