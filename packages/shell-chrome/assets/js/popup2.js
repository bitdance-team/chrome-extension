//天气
let key_w = "314285a761da4025bd4c09339dca5f0f"
var BitDanceSite = '北京'

var searchWeatherfn = async function() {
    // 用位置获取
    let url_jw = BitDanceSite
    let httpUrl = `https://geoapi.qweather.com/v2/city/lookup?location=${url_jw}&key=${key_w}`;
    //获取城市的ID
    // let httpUrl = `https://geoapi.qweather.com/v2/city/lookup?location=黔江区&adm=重庆&key=${key}`
    let res1 = await fetch(httpUrl); // 不能res，会冲突
    let result = await res1.json();
    let id = result.location[0].id;
    //根据城市id获取具体的天气
    let httpUrl1 = `https://devapi.qweather.com/v7/weather/now?location=${id}&key=${key_w}`
    let res2 = await fetch(httpUrl1);
    let result1 = await res2.json();
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

if(localStorage.getItem('weatherSiteSelet_Local')){//有缓存的时候
    document.getElementById("weatherSiteSelet").value = localStorage.getItem('weatherSiteSelet_Local')
    BitDanceSite = localStorage.getItem('weatherSiteSelet_Local')
    searchWeatherfn()
  }
  
  document.getElementById("weatherSiteSelet").onchange = function(){
      localStorage.removeItem('weatherSiteSelet_Local')
      let res3 = document.getElementById("weatherSiteSelet").value
      localStorage.setItem('weatherSiteSelet_Local',res3)
      BitDanceSite = res3
      searchWeatherfn()
  }
  
//天气end
