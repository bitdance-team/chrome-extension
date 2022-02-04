try {
  // 清除控制台
  console.clear();

  // refer: https://www.cuoshuo.com/blog/340811.html
  importScripts(
    // 右键菜单
    "assets/js/contextMenus.js",

    // 高级搜索
    "assets/js/advanced-search/background.js"
  );

} catch (e) { console.error(e) }
