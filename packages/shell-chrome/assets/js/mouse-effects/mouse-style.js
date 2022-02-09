/**
 * TODO: 鼠标样式
 */

$(function() {
    console.log("[BitDance extension] 学生助手插件 - 鼠标样式模块加载成功");
    // 每次改变开关状态时刷新页面使功能及时生效
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        // console.log(`进入 assets\js\mouse-effects\mouse-style.js 中的onMessage Listener`)

        if (request.info === 'mouse') {
            location.reload();
            sendResponse('Reload page  because of mouse-style');
        }

        // console.log(`离开 assets\js\mouse-effects\mouse-style.js 中的onMessage Listener`)
        return true;
    })

    // 控制功能是否开启
    chrome.storage.sync.get('clickState2', function(budget) {
        // 得到按钮开关状态
        if (budget.clickState2 == false || budget.clickState2 == undefined) {
            $('*').hover(function() {
                $(this).css("cursor", "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c%0A6QAABPxJREFUWEe9lltIalkYx9feak1hDBonIvVM0ZyKLmAM3YyIqB6KCgrK%0Abj710G1gKooJJrCYiB4q6qHefIgoKoaChpiieojQJIWiy0GygzaO0RVhSDTb%0Ae+1hOSlb3d56aL+Iur/1/db3/77/Whj4/6kGAOgAAPq37x/2gQEAyrRa7V9s%0ANhuTSqXk5eXlGUVRTR8FgwC+HB0dfc3JyWG7tq3RaAiZTAY/AgYBgNTU1Bed%0AThfBVHcE09DQQFxfX1+EUJkoAMAnAMDfoWroBMAwTAsh/ClYUACYIQzDfkeg%0ACQkJ5Pz8PG6xWB4oihIEW9MJwCRDsECVSoUqQ97c3BgrKioSNzc3I+kxZrMZ%0AikQinKIoVw7GJd1/BpLBH8zr6ysVHx9Pra2tUS0tLS9CoRBfW1vjJCQksFDM%0Azs4OUV1dPffy8vKLvzXcAKHKQF9ILpeTVVVVFL2B9/f3SQSTlJSEraysRAiF%0AQlagKtDL4zMNwWSoqakhNzY2nLtlehBMSUkJAtgDAKDRfvB+z0OfcGUYHx9/%0ALS4uxgoKCtwj7J0Ax3EAIQR7e3tEc3MzcX9/r6TDeAC8RwYulwufn59xpgos%0ALi46Li4u8LGxMQ9ABINM7+npSeTdoWHLMDIyQqhUKmp7e5tDhzg9PSXFYjEG%0AIWSEQw0cExMz5TMiiYmJNoPB8F0w/en/Ly0tvba2tnIKCgpIkUhEra6u4vn5%0A+VClUjFKgyojk8msFEXxfQDeIwMdBu2Mw+Ewzr5WqyXz8vIICOGPAIB/nCbI%0AsNMvSqXyq0Qi8dtYTNVBLri6usoYY7FYkCkRVqu1CtkDPZ6RVCAQ2A0GQ8To%0A6Cg8Pj4GEokEDg4OemjsDVFbW0vy+XxSoVC4zxRUjeTkZIfJZPoVADDDBM4I%0AgGGYjsfjfdna2oLIZA4PD4ny8nJ8YGAAyuXyoCOHEvX19dlnZ2f/dDgcDYH6%0AiQlgqLKycmh4eJhFdzi0SFlZmaO9vZ2qr6/38H2RSARvb28JkiQj5ubmHB0d%0AHc4qZGdn205OTlJceodUAQzDKGQcaWlpdp1O5zMNLmPp6uoiULPNzMyw0G96%0AvZ64uroCubm5OI/Hc49eMAjvCkRJpdJ/l5eX2fn5+Xa1Wu0DUFhYSCqVSqf9%0ASiQSQq1Ws6Ojo6FCoYBSqZRRnjeIH4JaMQDgc29v7+XU1FSk0WgkHx4ePA4a%0AlLSxsZFYWFhg0UetqamJnJiYwAQCAaPp0OTwgfDpAdTJT09PzoWYZMBxHPpz%0At2DmlZWVZTs/P/eAYDIis8lkike7KSoqsh0cHKBrlvNB9trW1gY0Go37BOzp%0A6bFNT0+73wkXwt8YIm8nMjIyMLPZ7JThzT7Z9N2jOedyuX+kp6dXHR8fvwvC%0A73UpMjJyxuFw/AwAcMoxODhIeJ9qSUlJdqPRiBILxWLxZTgQKSkpdr1eHxXw%0AvvZWzl2Kokq9S4vslc/n99EcLiyIycnJ1/7+/u9DAfi8u7v7rbS01GPEuFyu%0Aw2q1ehgSupKLxeLrYJVYX1931NXVyQEA46EAgLi4ONvd3Z3bE9CplpOTU+F9%0AsLxVKSAEPbm/05CpkT1kYLFYLxDCQHeGT5mZmddnZ2cejemdPBwAtwxoGlpb%0AW5MD+burEnQIpuThAIDY2Fj74+NjJI7jFnSTCTbvdIjOzk68u7t7GGnuHRdS%0AD7gWw3H8NwhhT4jJ6a8hKWxMcf8BWQiA/lSw+WUAAAAASUVORK5CYII=), auto");
            });
            $('a').hover(function() {
                $(this).css("cursor", "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c%0A6QAAA35JREFUSEvtVk1IG1EQnv1PNhEhVEloRa22gXqw3jyU5qAUQWk9iKjQ%0Ag7SIpIfmnJMHxaNQsYJUkLQSqAcP1VPFS6EeqwepFqOCaQ8x/kRo3N3se1tm%0AYdM02dhtrvVBEt6+b+abmffNbBhwvqpZlv0MADddLtf7bDY74ty0FMk4MRYE%0A4X4ikfhSV1dnwgkh4PF4FFVV3U7s7TCOiDs6Ouja2tofWEopyLL8UlXVV5WQ%0AOyI2DMModo6P3G63pqqqdE3spALXpbat0rW4sCz/Xzth1ufn5yWa0DQNtra2%0AoLu7W6GUjhBC3lY8Mu3E5aRX8Tpqa2shnU7jTFcKbSruYyfEFmZhYYEODw/f%0ABYCE9SxPLEnSo5qamtVwOMzPzc0ZyWTyga7r+BpEIZXM6n8hRmw0GjUmJyd5%0AAKC4N4klSbqTTqe/eb3evL9kMgn19fUvKKWv7Yjx1chxXFl+u3Oe53OEEDFP%0AzPM8yeVybLGXk5MTCAQCzzVNe4Mk6MxauD8+Pgafz1dCvrOzAy0tLaDrOjAM%0AA5lMxsSdnZ1BdXW1maz5FYlEjKmpKdvoLy8v8fVnZpfL5YBlWTMAURRNVVdV%0AVZXY7e3tQTAYzBNns1kTh/aiKL4jhDw1iVmW1QghQrm6WUQWMf4JEAQhH0ix%0AHbYUBmvhC/eCIPyklHotcXEbGxt6e3u7LbdFbJVuenraiEQijLW3M8IKra+v%0AQygUgqOjI2hoaDArxXGcTikVCtvJv7S09KOvr8+2xdBRZ2cnzM/Po+hgcXHR%0A6O/vZ5qbm439/X0GhY/3KUkSKIoCY2NjMD4+DqiTUChkHBwcMBcXF0iMg8Vd%0ATHJ7dnY2MTo6WpKEJRA86OrqgtXVVXNe8zwPeIeyLFsZmb941traSre3t03R%0AYjCIdblc3zVNu2WX3Y1oNJqamJiwzRzvFwVmrUAgAKlUCjY3N6GtrY3GYjF2%0AaGgof454rAR+MBiWZT0AkC07uQYGBmg8Hnc02VZWVoyenh4mHo/D4OBg2d5u%0AbGyEw8PD3+1UBlkVDoczMzMzjsj/Nsmwh30+3z0A+Jrv4yuM5N7e3szy8jKO%0AuooXlliW5U+Kojy0nDjJhgsGgzpOo0qWqqrg9Xo/6Lr+uNDeCbGJb2pqMnZ3%0Ad6+cz5ZjVPXp6Sn4/X5CKbWtlmNidCoIwjNK6ZOrMhdFMaNp2kdCSOwq3C/H%0Acfgu+27rfgAAAABJRU5ErkJggg==), crosshair");
            });
        } else {
            ('*').hover(function() {
                $(this).css("cursor", "auto");
            });
        }
    })
})