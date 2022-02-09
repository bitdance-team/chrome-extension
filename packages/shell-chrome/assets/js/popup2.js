//天气
let key_w = "314285a761da4025bd4c09339dca5f0f"
var longitude = 116.40
var latitude = 39.90

var searchWeatherfn = async function() {
    // 用经纬度获取
    let url_jw = longitude + ',' + latitude;
    console.log("url_jw: " + url_jw);
    let httpUrl = `https://geoapi.qweather.com/v2/city/lookup?location=${url_jw}&key=${key_w}`;
    //获取城市的ID
    // let httpUrl = `https://geoapi.qweather.com/v2/city/lookup?location=黔江区&adm=重庆&key=${key}`
    let res1 = await fetch(httpUrl); // 不能res，会冲突
    let result = await res1.json();
    console.log("下面是result");
    console.log(result);
    document.getElementById("weatherSite").innerHTML = result.location[0].adm1;
    let id = result.location[0].id;
    console.log(id);
    //根据城市id获取具体的天气
    let httpUrl1 = `https://devapi.qweather.com/v7/weather/now?location=${id}&key=${key_w}`
    let res2 = await fetch(httpUrl1);
    let result1 = await res2.json();

    console.log(result1)
    console.log(result1.now);
    //显示天气情况
    let now = result1.now.text;
    document.getElementById("weatherText").innerHTML = now;
    //显示温度
    let nowTemp = result1.now.temp
    document.getElementById("weatherTemp").innerHTML = nowTemp + '°';
    //显示图标
    let svg_icon = result1.now.icon;
    document.getElementById("svg_w").src = "./assets/image/weather/icons/" + svg_icon + ".svg";
    //切换背景色
    var bobyEI = document.body;
    // var bobyEI = document.getElementById("weather")
    svg_icon = parseInt(svg_icon);
    if (100 <= svg_icon && svg_icon < 101) {
        bobyEI.style = "background: url(./assets/image/weather/sun.webp) no-repeat; background-size: cover;"
    } else if (101 <= svg_icon && svg_icon < 104) {
        bobyEI.style = "background: url(./assets/image/weather/yun.webp) no-repeat; background-size: cover;"
    } else if (104 <= svg_icon && svg_icon < 150) {
        bobyEI.style = "background: url(./assets/image/weather/yin.webp) no-repeat; background-size: cover;"
    } else if (150 <= svg_icon && svg_icon < 300) {
        bobyEI.style = "background: url(./assets/image/weather/night.webp) no-repeat; background-size: cover;"
    } else if (300 <= svg_icon && svg_icon < 400) {
        bobyEI.style = "background: url(./assets/image/weather/yu.webp) no-repeat; background-size: cover;"
    } else if (400 <= svg_icon && svg_icon < 500) {
        bobyEI.style = "background: url(./assets/image/weather/xue.webp) no-repeat; background-size: cover;"
    } else {
        bobyEI.style = "background: url(./assets/image/weather/yun.webp) no-repeat; background-size: cover;"
    }
}

function find_site() { //获取浏览器的经纬度
    console.log("开始定位浏览器位置")
    localStorage.removeItem('BitD_longitude')
    localStorage.removeItem('BitD_latitude')
    navigator.geolocation.getCurrentPosition(onSuccess); // 获取经纬度
    function onSuccess(position) {
        //经度
        longitude = position.coords.longitude;
        localStorage.setItem('BitD_longitude', longitude)
        console.log("longitude:" + longitude)

        //纬度
        latitude = position.coords.latitude;
        localStorage.setItem('BitD_latitude', latitude)
        console.log("latitude:" + latitude)
        console.log("获得浏览器经纬度而且写入localstorage end")
    }
}

if (localStorage.getItem('BitD_longitude')) { //没有缓存
    longitude = localStorage.getItem('BitD_longitude')
    latitude = localStorage.getItem('BitD_latitude')
    searchWeatherfn()
} else { // 没有缓存的时候 或者 需要更新的时候
    console.log("没有找到")
    find_site()
    searchWeatherfn()
}

document.getElementById("weatherSite").onclick = function() {
    find_site()
    searchWeatherfn()
}

//天气end
