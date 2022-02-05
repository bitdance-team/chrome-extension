$(function() {
    // 获取开关状态
    chrome.storage.sync.get('clickState2', function(budget) {
        // console.log(budget.clickState);
        // 获取页面节点
        let input = document.querySelector("#button-2");
        // 改变开关状态（保持与上次设置时一致）
        input.checked = budget.clickState2;
    });
    // 获取开关状态
    chrome.storage.sync.get('clickState3', function(budget) {
        // console.log(budget.clickState);
        // 获取页面节点
        let input = document.querySelector("#button-3");
        // 改变开关状态（保持与上次设置时一致）
        input.checked = budget.clickState3;
    });

    // 点击开关时改变按钮状态
    $("#button-2").click(function() {
        // 获取开关
        let checked = $("#button-2");
        // 持久化存储开关状态
        chrome.storage.sync.set({ 'clickState2': checked[0].checked });
        console.log('mouse success');

        // 自动刷新页面
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, (tabs) => {
            console.log(tabs);
            let message = {
                info: 'reload'
            }
            chrome.tabs.sendMessage(tabs[0].id, message, res => {
                console.log(res);
            })
        })
    });

    // 点击开关时改变按钮状态
    $("#button-3").click(function() {
        // 获取开关
        let checked = $("#button-3");
        // 持久化存储开关状态
        chrome.storage.sync.set({ 'clickState3': checked[0].checked });
        console.log('click success');

        // 自动刷新页面
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, (tabs) => {
            console.log(tabs);
            let message = {
                info: 'reload'
            }
            chrome.tabs.sendMessage(tabs[0].id, message, res => {
                console.log(res);
            })
        })
    })

    // Direct Url
    const btnDirectUrl = document.querySelector("#btnDirectUrl");
    chrome.storage.sync.get("linkOpen", ({ linkOpen }) => {
      btnDirectUrl.checked = !linkOpen;
    });

    btnDirectUrl.addEventListener("change", () => {
        chrome.storage.sync.set({ linkOpen: !btnDirectUrl.checked });
    });
})
