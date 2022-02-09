
    (async function() {
    // 删除DOM
    function removeDOM(querySelector) {
        let element = document.querySelector(querySelector)
        if (element != null) {
            element.parentNode.removeChild(element);
        }
    }

    // 插件刚开始加载时，先读取一次状态
    var isExpandFulltextActived = true;
    isExpandFulltextActived = await new Promise((resolve) => {
        chrome.storage.sync.get('State_ExpandFulltext', function (State) {
          resolve(State.State_ExpandFulltext);
        });
    });
    console.log(`isExpandFulltextActived: ${isExpandFulltextActived}`);
    if(!isExpandFulltextActived)
        return;

    console.log("[BitDance extension] 学生助手插件 - 阅读全文自动展开模块加载成功");

    switch (window.location.host) {
      default:
        break;

      case "blog.csdn.net": // CSDN博客
        $(function () {
            removeDOM(".hide-article-box");
            $(".article_content").removeAttr('style');
            window.onload = () => {
                // 代码块自动展开
                document.querySelectorAll("pre").forEach(targetNode => {
                    removeDOM(".hide-preCode-box");
                    if (targetNode.classList.contains("set-code-hide")) {
                        targetNode.classList.remove("set-code-hide");
                    }
                })
            }
        })
        break;

      case "www.it1352.com": // it1352
      console.log("[BitDance extension] 学生助手插件 - it1352");
        window.onload = () => {
            $('.arc-body-main').height("initial")
            $('.arc-body-main-more').remove()
        }
        break;

    }
})();
