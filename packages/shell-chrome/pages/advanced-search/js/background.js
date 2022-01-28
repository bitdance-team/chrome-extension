chrome.contextMenus.create({
    id: 'bitdance-advanced-search',
    title: '高级搜索',
    parentId: 'bitdance',
    onclick: function (info) {
        alert('当前菜单信息:'+ JSON.stringify(info))
        alert("[BitDance extension] 学生助手插件 - 高级搜索 已点击菜单")
    }
})