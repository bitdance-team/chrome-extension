$(function() {
    console.log("[BitDance extension] 学生助手插件 - 阅读全文自动展开模块加载成功");
    // 删除DOM
    function removeDOM(querySelector) {
        let element = document.querySelector(querySelector)
        if (element != null) {
            element.parentNode.removeChild(element);
        }
    }
    switch (window.location.host) {
      default:
        break;

      case "blog.csdn.net": // CSDN博客
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
        break;

      case "www.it1352.com": // it1352
      console.log("[BitDance extension] 学生助手插件 - it1352");
        window.onload = () => {
            $('.arc-body-main').height("initial")
            $('.arc-body-main-more').remove()
        }
        break;

    }
})
