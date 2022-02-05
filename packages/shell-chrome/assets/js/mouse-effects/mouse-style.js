/**
 * TODO: 鼠标样式
 */

$(function() {
    console.log("[BitDance extension] 学生助手插件 - 鼠标样式模块加载成功");
    // 每次改变开关状态时刷新页面使功能及时生效
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        console.log(`进入 assets\js\mouse-effects\mouse-style.js 中的onMessage Listener`)
        if (request.senderId !== "mouse-effects") {
          // 抛给下一个Listener
          sendResponse();
        }
        // TODO: 这里不能这么写，否则会导致其他模块发送消息时触发页面刷新
        // console.log('mouse');
        // location.reload();
        // sendResponse('Reload page');

        console.log(`离开 assets\js\mouse-effects\mouse-style.js 中的onMessage Listener`)
        return true;
    })

    // 控制功能是否开启
    chrome.storage.sync.get('clickState2', function(budget) {
        // 得到按钮开关状态
        if (budget.clickState2 == false || budget.clickState2 == undefined) {
            $('*').hover(function() {
                $(this).css("cursor", "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c%0A6QAABPxJREFUWEe9lltIalkYx9feak1hDBonIvVM0ZyKLmAM3YyIqB6KCgrK%0Abj710G1gKooJJrCYiB4q6qHefIgoKoaChpiieojQJIWiy0GygzaO0RVhSDTb%0Ae+1hOSlb3d56aL+Iur/1/db3/77/Whj4/6kGAOgAAPq37x/2gQEAyrRa7V9s%0ANhuTSqXk5eXlGUVRTR8FgwC+HB0dfc3JyWG7tq3RaAiZTAY/AgYBgNTU1Bed%0AThfBVHcE09DQQFxfX1+EUJkoAMAnAMDfoWroBMAwTAsh/ClYUACYIQzDfkeg%0ACQkJ5Pz8PG6xWB4oihIEW9MJwCRDsECVSoUqQ97c3BgrKioSNzc3I+kxZrMZ%0AikQinKIoVw7GJd1/BpLBH8zr6ysVHx9Pra2tUS0tLS9CoRBfW1vjJCQksFDM%0Azs4OUV1dPffy8vKLvzXcAKHKQF9ILpeTVVVVFL2B9/f3SQSTlJSEraysRAiF%0AQlagKtDL4zMNwWSoqakhNzY2nLtlehBMSUkJAtgDAKDRfvB+z0OfcGUYHx9/%0ALS4uxgoKCtwj7J0Ax3EAIQR7e3tEc3MzcX9/r6TDeAC8RwYulwufn59xpgos%0ALi46Li4u8LGxMQ9ABINM7+npSeTdoWHLMDIyQqhUKmp7e5tDhzg9PSXFYjEG%0AIWSEQw0cExMz5TMiiYmJNoPB8F0w/en/Ly0tvba2tnIKCgpIkUhEra6u4vn5%0A+VClUjFKgyojk8msFEXxfQDeIwMdBu2Mw+Ewzr5WqyXz8vIICOGPAIB/nCbI%0AsNMvSqXyq0Qi8dtYTNVBLri6usoYY7FYkCkRVqu1CtkDPZ6RVCAQ2A0GQ8To%0A6Cg8Pj4GEokEDg4OemjsDVFbW0vy+XxSoVC4zxRUjeTkZIfJZPoVADDDBM4I%0AgGGYjsfjfdna2oLIZA4PD4ny8nJ8YGAAyuXyoCOHEvX19dlnZ2f/dDgcDYH6%0AiQlgqLKycmh4eJhFdzi0SFlZmaO9vZ2qr6/38H2RSARvb28JkiQj5ubmHB0d%0AHc4qZGdn205OTlJceodUAQzDKGQcaWlpdp1O5zMNLmPp6uoiULPNzMyw0G96%0AvZ64uroCubm5OI/Hc49eMAjvCkRJpdJ/l5eX2fn5+Xa1Wu0DUFhYSCqVSqf9%0ASiQSQq1Ws6Ojo6FCoYBSqZRRnjeIH4JaMQDgc29v7+XU1FSk0WgkHx4ePA4a%0AlLSxsZFYWFhg0UetqamJnJiYwAQCAaPp0OTwgfDpAdTJT09PzoWYZMBxHPpz%0At2DmlZWVZTs/P/eAYDIis8lkike7KSoqsh0cHKBrlvNB9trW1gY0Go37BOzp%0A6bFNT0+73wkXwt8YIm8nMjIyMLPZ7JThzT7Z9N2jOedyuX+kp6dXHR8fvwvC%0A73UpMjJyxuFw/AwAcMoxODhIeJ9qSUlJdqPRiBILxWLxZTgQKSkpdr1eHxXw%0AvvZWzl2Kokq9S4vslc/n99EcLiyIycnJ1/7+/u9DAfi8u7v7rbS01GPEuFyu%0Aw2q1ehgSupKLxeLrYJVYX1931NXVyQEA46EAgLi4ONvd3Z3bE9CplpOTU+F9%0AsLxVKSAEPbm/05CpkT1kYLFYLxDCQHeGT5mZmddnZ2cejemdPBwAtwxoGlpb%0AW5MD+burEnQIpuThAIDY2Fj74+NjJI7jFnSTCTbvdIjOzk68u7t7GGnuHRdS%0AD7gWw3H8NwhhT4jJ6a8hKWxMcf8BWQiA/lSw+WUAAAAASUVORK5CYII=), crosshair");
            });
        } else {
            ('*').hover(function() {
                $(this).css("cursor", "auto");
            });
        }
    })
})
