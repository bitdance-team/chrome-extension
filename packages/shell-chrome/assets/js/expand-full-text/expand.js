/**
 * TODO: 实现CSDN自动展开全文
 */

$(function() {
    console.log("[BitDance extension] 学生助手插件 - CSDN阅读全文自动展开模块加载成功");
    // 全文自动展开
    function removeDOM(querySelector) {
        let element = document.querySelector(querySelector)
        if (element != null) {
            element.parentNode.removeChild(element);
        }
    }
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