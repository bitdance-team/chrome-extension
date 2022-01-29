window.onload = function(){
    
    chrome.storage.sync.get("linkOpen", ({ linkOpen })=>{
        if(linkOpen){
            let locHost = location.host,locHref = location.href;

        let methods = {
            http(link, s = false) {
                return link.startsWith("http")
                    ? link
                    : (s ? "https://" : "http://") + link;
            },    
        };

        let RedirectPage = {
            sites: {
                "c.pc.qq.com": {
                    include: "middlem.html?pfurl=",
                    selector: "#url",
                },
                "docs.qq.com": {
                    include: "scenario/link.html?url=",
                    selector: "span.url-src",
                    timeout: 500,
                },
                "www.tianyancha.com": {
                    include: "security?target=",
                    selector: "div.security-link",
                },
                "jump.bdimg.com": {
                    include: "safecheck/index?url=",
                    selector: "div.warning_info.fl>a",
                },
                "jump2.bdimg.com": {
                    include: "safecheck/index?url=",
                    selector: "div.warning_info.fl>a",
                },
                "www.chinaz.com": {
                    include: "go.shtml?url=",
                    selector: "div.link-bd__text",
                },
                "www.douban.com": {
                    include: "link2/?url=",
                    selector: "a.btn-redir",
                },
                "iphone.myzaker.com" : {
                    include: "zaker/link.php?",
                    selector: "a.btn",
                },
                "www.itdaan.com": {
                    include: "link/",
                    selector: "a.c-footer-a1",
                },
                "link.csdn.net": {
                    include: "?target=",
                    selector: "a.loading-btn",
                    timeout: 100,
                },
                "link.zhihu.com":{
                    include :"?target=",
                    selector : "a.button"
                },
                "link.juejin.cn": {
                    include: "?target=",
                    selector: 'p[style="margin: 0px;"]',
                },
                "www.jianshu.com": {
                    include: "go-wild?ac=2&url=",
                    selector: 'div[title^="http"], div[title^="www"]',
                },
                // QQ、腾讯文档、天眼查、百度贴吧、站长之家、豆瓣、Zaker、开发者知识库、CSDN、知乎、掘金、简书etc...
            },

            redirect(host){
                let site = this.sites[host];
                if (site) {
                    let include = host + "/" + site.include;
                    if (locHref.includes(include) || site.match && locHref.match(site.match)) {
                        
                        let target = document.querySelector(site.selector);
                        if (target.length) location.replace(target.href || target.innerText);
                
                    }
                }
            }
        }

        locHref = locHref.split(RedirectPage.sites[locHost].include);
        if(locHref){
            location.replace(decodeURIComponent(locHref[1]));
        }else{
            //改进
            let target = document.querySelector(RedirectPage.sites[locHost].selector);
            location.replace(target.href || target.innerText)
        }

        //两种方案 默认不阻止重定向 阻止重定向直接跳转
        }
    })
}