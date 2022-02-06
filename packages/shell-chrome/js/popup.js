window.onload=function(){
//默认参数
var appid = '20200808000537374';
var key = 'Cmd_ULw3GR00smgAg165';
var salt = Math.random(1111111111,9999999999);
var from = 'auto';
var to = 'auto'; 
//天气 
    var searchWeatherfn = async function() {
      let key = "314285a761da4025bd4c09339dca5f0f"
        //获取浏览器的经纬度
        var longitude = 116.20
        var latitude = 39.56
        // if (navigator.geolocation){   //检测是否支持地理定位
        //     navigator.geolocation.getCurrentPosition(onSuccess);
        //   } else{
        //       console.log("eorr");
        //           }
        // function onSuccess(position){
        //   //经度
        //   longitude =position.coords.longitude;
        //   console.log("longitude:"+longitude)
        //   //纬度
        //   latitude = position.coords.latitude;
        //   console.log("latitude:"+latitude)
        // }
        //用经纬度获取
        let url_jw = longitude+','+latitude
        console.log(url_jw)
        let httpUrl = `https://geoapi.qweather.com/v2/city/lookup?location=${url_jw}&key=${key}`
        //获取城市的ID
        // let httpUrl = `https://geoapi.qweather.com/v2/city/lookup?location=黔江区&adm=重庆&key=${key}`
        let res1 = await fetch(httpUrl)// 不能res，会冲突
        let result = await res1.json()
        let id = result.location[0].id
        console.log(result)
        console.log(id)
        //根据城市id获取具体的天气
        let httpUrl1 = `https://devapi.qweather.com/v7/weather/now?location=${id}&key=${key}`
        let res2 = await fetch(httpUrl1)
        let result1 = await res2.json()
        
        console.log(result1)
        console.log(result1.now)
        //显示天气情况
        let now = result1.now.text
        document.getElementById("weatherText").innerHTML= now
        //显示温度
        let nowTemp = result1.now.temp
        document.getElementById("weatherTemp").innerHTML= nowTemp+'°'
        //显示图标
        let svg_icon = result1.now.icon
        document.getElementById("svg_w").src="./img/icons/"+svg_icon+".svg"
        //切换背景色
        var bobyEI = document.body
        svg_icon = parseInt(svg_icon) 
        if(100<=svg_icon&&svg_icon<101){
          bobyEI.style.backgroundImage = "url(./img/sun.webp)"
        }else if(101<=svg_icon&&svg_icon<104){
          bobyEI.style.backgroundImage = "url(./img/yun.webp)"
        }else if(104<=svg_icon&&svg_icon<150){
          bobyEI.style.backgroundImage = "url(./img/yin.webp)"
        }else if(150<=svg_icon&&svg_icon<300){
          bobyEI.style.backgroundImage = "url(./img/night.webp)"
        }else if(300<=svg_icon&&svg_icon<400){
          bobyEI.style.backgroundImage = "url(./img/yu.webp)"
        }else if(400<=svg_icon&&svg_icon<500){
          bobyEI.style.backgroundImage = "url(./img/xue.webp)"
        }else{
          bobyEI.style.backgroundImage = "url(./img/yun.webp)"
        }
    }
    
    // console.log("天气console")
    searchWeatherfn()
//天气end

//翻译
  var postMsg = async function(){
    from = document.getElementById("inputLangSelect").value
    to = document.getElementById("outLangSelect").value
    var msgq = document.getElementById("inputLang").value
    // 翻译api
    salt = Math.random(1111111111,9999999999)
    var str1 = appid + msgq + salt +key;
    var sign = MD5(str1);

    let httpUrl1 ="http://api.fanyi.baidu.com/api/trans/vip/translate?q="
    +msgq+"&from="+from+"&to="+to+"&appid="+appid+"&salt="+salt+"&sign="+sign+""
    let res1 = await fetch(httpUrl1)
    let result1 = await res1.json()
    let res2 = result1.trans_result[0].dst
    document.getElementById("outPutRes").innerHTML=res2

    }
    var onInputChange = async function(){
      //得到输入框中的内容
      var msgq = document.getElementById("inputLang").value
      //  var msgq = $("#inputLang").val()
      //自动检测语言类别
      var LTypeSign = appid + msgq + salt + key
      LTypeSign = MD5(LTypeSign)

      let httpUrl1 ="https://fanyi-api.baidu.com/api/trans/vip/language?q="+msgq+"&salt="+salt+"&sign="+LTypeSign+"&appid="+appid+""
      let res1 = await fetch(httpUrl1)
      let result1 = await res1.json()
      let res2 = result1.data.src
      if(res2=='en'){
        document.getElementById("LangType").innerHTML='英文'
      }else if(res2=='zh'){
        document.getElementById("LangType").innerHTML='简体中文'
      }else{
        document.getElementById("LangType").innerHTML=res
      }
    
      postMsg()
    }

    document.getElementById("inputLang").onchange = function(){
      onInputChange()
    }
    
    document.getElementById("tranbtn").onclick = function(){
      postMsg()
    }
  
//翻译end   


}
