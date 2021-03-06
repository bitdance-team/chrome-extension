$(function() {
    /**
     * 鼠标样式
     */
    // 页面加载时，更新界面开关状态
    chrome.storage.sync.get('State_MouseStyle', function(budget) {
        document.querySelector("#btnMouseStyle").checked = budget.State_MouseStyle;
    });

    // 点击开关时存储按钮状态并刷新页面
    $("#btnMouseStyle").click(function() {
        chrome.storage.sync.set({ 'State_MouseStyle': $("#btnMouseStyle")[0].checked });
        refreshPage('Mouse Style');
    });


    /**
     * 鼠标特效
     */
    // 页面加载时，更新界面开关状态
    chrome.storage.sync.get('State_MouseEffect', function(budget) {
        document.querySelector("#btnMouseEffect").checked = budget.State_MouseEffect;
    });

    // 点击开关时存储按钮状态并刷新页面
    $("#btnMouseEffect").click(function() {
        chrome.storage.sync.set({ 'State_MouseEffect': $("#btnMouseEffect")[0].checked });
        refreshPage('Mouse Effect');
    })


    /**
     * Direct Url
     */
    const btnDirectUrl = document.querySelector("#btnDirectUrl");
    // 页面加载时，更新界面开关状态
    chrome.storage.sync.get("State_DirectUrl", ({ State_DirectUrl }) => {
        btnDirectUrl.checked = !State_DirectUrl;
    });

    // 点击开关时存储按钮状态并刷新页面
    btnDirectUrl.addEventListener("change", () => {
        chrome.storage.sync.set({ State_DirectUrl: !btnDirectUrl.checked });
        refreshPage('Direct Url');
    });


    /**
     * Expand Fulltext
     */
    const btnExpandFulltext = document.querySelector("#btnExpandFulltext");
    // 页面加载时，更新界面开关状态
    chrome.storage.sync.get("State_ExpandFulltext", ({ State_ExpandFulltext }) => {
      btnExpandFulltext.checked = !State_ExpandFulltext;
    });

    // 点击开关时存储按钮状态并刷新页面
    btnExpandFulltext.addEventListener("change", () => {
        chrome.storage.sync.set({ State_ExpandFulltext: !btnExpandFulltext.checked });
        refreshPage('Expand Fulltext');
    });


    /**
     * Google广告拦截
     */
    const btnGoogleAds = document.querySelector("#btnAdsBlock");
    // 页面加载时，更新界面开关状态
    chrome.storage.sync.get('State_AdsBlock', function(budget) {
        btnGoogleAds.checked = !budget.State_AdsBlock;
    });

    // 点击开关时存储按钮状态并刷新页面
    $("#btnAdsBlock").click(function() {
        chrome.storage.sync.set({ 'State_AdsBlock': !btnGoogleAds.checked });
        chrome.extension.getBackgroundPage().updateAdsBlockStatus(!btnGoogleAds.checked);
        refreshPage('Ads Block');
    })


    /**
     * SS 快捷搜索
     */
    const btnSSSearch = document.querySelector("#btnSSSearch");
    // 页面加载时，更新界面开关状态
    chrome.storage.sync.get('State_SSSearch', function(budget) {
      btnSSSearch.checked = !budget.State_SSSearch;
    });

    // 点击开关时存储按钮状态并刷新页面
    $("#btnSSSearch").click(function() {
        chrome.storage.sync.set({ 'State_SSSearch': !btnSSSearch.checked });
        // refreshPage('SS Search');
    })


    /**
     * 截图
     */
    document.getElementById("btnScreenshot").addEventListener("click", () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if(!isBrowserSettingPage({ url: tabs[0].url, action: "截图", showSorryInfo: true })) {
                chrome.extension.getBackgroundPage().takeScreenshot(tabs[0]);
                window.close();
            }
        })
    });


    /**
     * 翻译
     */
    document.getElementById("transform").onclick = function () {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if(!isBrowserSettingPage({ url: tabs[0].url, action: "翻译", showSorryInfo: true })) {
                chrome.extension.getBackgroundPage().showTranslationWindow()
                window.close();
            }
        })
    }


    /**
     * 番茄钟
     */
    // 获取番茄钟页面状态
    chrome.storage.sync.get('clockState', function(budget) {
        console.log(budget.clockState);
        if (budget.clockState === "block") {
            $('#back').css("display", "block");
            $('#article').css("display", "none");
            $('#pomodoro').css("display", "block");
        } else if (budget.clockState === "none") {
            $('#article').css("display", "block");
            $('#pomodoro').css("display", "none");
        }
    });

    $('#clock').click(function() {
        $('#pomodoro').fadeIn(500);
        $('#article').fadeOut(0);
        $('#back').css("display", "block");
        chrome.storage.sync.set({ "clockState": "block" });
    });

    $('#back').click(function() {
        $('#pomodoro').fadeOut(0);
        $('#article').fadeIn(200);
        $('#back').css("display", "none");
        chrome.storage.sync.set({ "clockState": "none" });
    })

    // ****************************************************************************************************************

    /**
     * 判断是否是浏览器设置页面
     * 即是否是 chrome:// 或 edge:// 开头的链接
     * @param {} url
     * @returns
     */
    function isBrowserSettingPage({url, action, showSorryInfo = true }) {
      var protocol, isSettingPage = true;
      if(/^chrome:\/\/.*$/.test(url)) {
          protocol = "chrome://"
      } else if(/^edge:\/\/.*$/.test(url)) {
          protocol = "edge://"
      } else {
          isSettingPage = false;
      }
      if(showSorryInfo && isSettingPage) {
          alert(`十分抱歉，由于浏览器限制，“${protocol}”开头的网站不支持${action}`);
      }
      return isSettingPage;
    }

    /**
     * 改变开关自动刷新页面
     */
    function refreshPage(messageInfo) {
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, (tabs) => {
            console.log(tabs);
            let message = {
                info: messageInfo,
                action: "refreshPage"
            }
            chrome.tabs.sendMessage(tabs[0].id, message, res => {
                console.log(res);
            })
        })
    }
})
