/**
 * 鼠标点击效果
 */

$(function() {
    // 控制功能是否开启
    chrome.storage.sync.get('State_MouseEffect', function(budget) {
        // 得到按钮开关状态
        if (budget.State_MouseEffect == false || budget.State_MouseEffect == undefined) {
            console.log("[BitDance extension] 学生助手插件 - 点击特效模块加载成功");

            var hearts = [];

            walk();

            // 走起（初始化）
            function walk() {
                // 灵魂 css
                css("#heart{width: 10px;height: 10px;position: fixed;background: pink;transform: rotate(45deg);}#heart::after,#heart::before{position: absolute;content: '';width: inherit;height: inherit;background: inherit;border-radius: 50%;}#heart::after{top: -5px;}#heart::before{left: -5px;}");
                attachEvent();
                gameloop();
            }

            // 动画效果
            function gameloop() {
                for (var i = 0; i < hearts.length; i++) {
                    if (hearts[i].alpha <= 0) {
                        document.body.removeChild(hearts[i].el);
                        hearts.splice(i, 1);
                        continue;
                    }
                    hearts[i].y--;
                    hearts[i].scale += 0.004;
                    hearts[i].alpha -= 0.013;
                    hearts[i].el.style.cssText = "left:" + hearts[i].x + "px;top:" + hearts[i].y + "px;opacity:" + hearts[i].alpha + ";transform:scale(" + hearts[i].scale + "," + hearts[i].scale + ") rotate(45deg);background:" + hearts[i].color;
                }
                // refer: https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame
                requestAnimationFrame(gameloop);
            }

            function attachEvent() {
                // 点击触发特效（♥）
                window.onclick = function(event) {
                    createHeart(event);
                }
            }

            function createHeart(event) {
                // 创建一个 div 并指定类名为 heart
                var d = document.createElement("div");
                d.id = "heart";
                /**
                 * @param el: 每个 div 的标识
                 * @param x,y: 当前鼠标位置信息
                 * @param scale: 放大系数
                 * @param alpha: 透明度
                 * @param color: 背景颜色
                 */
                hearts.push({
                    el: d,
                    x: event.clientX,
                    y: event.clientY - 12,
                    scale: 1,
                    alpha: 1,
                    color: randomColor()
                });
                document.body.appendChild(d);
            }

            // 给网页加个 style 标签
            function css(css) {
                // 创建 style 标签
                var style = document.createElement("style");
                style.type = "text/css";
                // css 内容注入
                style.appendChild(document.createTextNode(css));

                document.head.appendChild(style);
            }

            // 生成随机颜色
            function randomColor() {
                return "rgb(" + (Math.random() * 255) + "," + (Math.random() * 255) + "," + (Math.random() * 255) + ")";
            }
        }
    });
})
