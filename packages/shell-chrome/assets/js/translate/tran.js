if (typeof (BitTarnsDiv) !== "undefined") {
    console.log("存在 BitTarnsDiv")
    BitTarnsDiv.parentNode.removeChild(BitTarnsDiv)
}
var BitTarnsDiv = document.createElement("div")
BitTarnsDiv.id = "BitTarnsDivId"
document.body.appendChild(BitTarnsDiv)
BitTarnsDiv.style.backgroundColor = "red"
BitTarnsDiv.style.height = "450px"
BitTarnsDiv.style.width = "300px"
BitTarnsDiv.style.zIndex = 99999
BitTarnsDiv.style.position = "fixed"
BitTarnsDiv.style.right = '10px'
BitTarnsDiv.style.top = '50px'
BitTarnsDiv.style.float = 'right'


BitTarnsDiv.innerHTML = `
 <div id = 'trans'>
            <select id="inputLangSelect">
            <option value="auto">自动检测语言</option>
            <option value="zh">简体中文</option>
            <option value="en">English</option>
            </select>
          <select id="outLangSelect">
            <option value="zh">简体中文</option>
            <option value="en">English</option>
            </select>
            <button id="deleteTrans">关闭</button>
          <input type="text" id="inputLang" value="" placeholder="请输入翻译内容"  >
          <br>
            自动检测语言：<p id="LangType"></p><button id="tranbtn">翻译</button>
          <hr>
        <p id="outPutRes"></p>
</div>
 `

var from = 'auto';
var to = 'auto';

var postMsg = async function () {
    from = document.getElementById("inputLangSelect").value
    to = document.getElementById("outLangSelect").value
    var msgq = document.getElementById("inputLang").value
    // 翻译api
    msgq = encodeURIComponent(msgq)

    let httpUrl1 = "//qca566.api.cloudendpoint.cn/hello?msgq=" +
        msgq + "&from=" + from + "&to=" + to + ""
    let res1 = await fetch(httpUrl1)
    let result1 = await res1.json()
    let res2 = result1.trans_result[0].dst

    document.getElementById("outPutRes").innerHTML = res2
}

var onInputChange = async function () {

    var msgq = document.getElementById("inputLang").value
    msgq = encodeURIComponent(msgq)
    let httpUrl1 = "//qca566.api.cloudendpoint.cn/transLang?msgq=" + msgq + ""
    let res1 = await fetch(httpUrl1)
    let result1 = await res1.json()
    let res2 = result1.data.src
    if (res2 == 'en') {
        document.getElementById("LangType").innerHTML = '英文'
    } else if (res2 == 'zh') {
        document.getElementById("LangType").innerHTML = '简体中文'
    } else {
        document.getElementById("LangType").innerHTML = res
    }
    postMsg()
}

//触发识别语言，再翻译
document.getElementById("inputLang").onchange = function () {
    onInputChange()
}
//直接翻译
document.getElementById("tranbtn").onclick = function () {
    postMsg()
}
//关闭翻译模块
document.getElementById("deleteTrans").onclick = function () {
    BitTarnsDiv.parentNode.removeChild(BitTarnsDiv)
    BitTarnsDiv = undefined
}