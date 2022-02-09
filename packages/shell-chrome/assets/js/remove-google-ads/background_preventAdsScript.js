// refer: https://www.it1352.com/1996113.html
chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
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
