// 用户首次安装插件时执行一次，后面不会再重新执行(除非用户重新安装插件)
chrome.runtime.onInstalled.addListener(() => {
  // 插件功能安装默认启用
  chrome.storage.sync.set({
    //初始化数据
    pomoData: {
      minutes: 24,
      seconds: 60,
      countdownTimer: "25:00",
      status: "init",
    },
  });
});

let minutes, seconds;
let pause;
let pomodoro = "pomodoro";

let array = ["minutes", "seconds", "pause", "countdownTimer", "pbutton"];

//全局唯一的定时器
let timer = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { status, content } = message;

  console.log(message);

  if (status === "start") {
    // sendResponse({
    //   status:message.status
    // })
    countdown({ ...content, status });
  } else if (status === "paused") {
    clearTimeout(timer);
    chrome.storage.sync.get("pomoData", ({ pomoData }) => {
      console.log(pomoData);
      chrome.storage.sync.set({ pomoData: { ...pomoData, status: "paused" } });
    });
  } else if (status === "reset") {
    clearTimeout(timer);
    chrome.storage.sync.set({
      pomoData: {
        minutes: 24,
        seconds: 60,
        countdownTimer: "25:00",
        status: "init",
      },
    });
  } else if (status === "init") {
    //init初始化
    chrome.storage.sync.set({
      pomoData: {
        minutes: 24,
        seconds: 60,
        countdownTimer: "25:00",
        status: "start",
      },
    });
  } else {
    //playend 初始化
    chrome.storage.sync.set({
      pomoData: {
        minutes: 24,
        seconds: 60,
        countdownTimer: "25:00",
        status: "playend",
      },
    });
  }

    //创建结束通知：待完成
    
  chrome.storage.sync.set({
    status,
  });
  //后台播放完成提示音乐
  if (message.action === "play") {
    // audio.play();
  }
  sendResponse();
});

// 番茄钟倒计时功能
function countdown({ minutes, seconds, status }) {
  // 设置分钟和秒数
  // let currentMins = minutes - 1;
  seconds--;
  let currentTimer =
    (minutes < 10 ? "0" : "") +
    minutes +
    ":" +
    (seconds < 10 ? "0" : "") +
    seconds;
  // countdownTimer.innerHTML = currentTimer; 拿到
  console.log("分秒=============", minutes, seconds);

  chrome.storage.sync.set(
    {
      pomoData: {
        seconds: seconds,
        minutes: minutes,
        countdownTimer: currentTimer,
        status,
      },
    },
    function () {
      if (!chrome.runtime.error) {
        console.log("started");
      }
    }
  );

  //设置badge文本用来显示剩余分钟数
  chrome.storage.sync.get("pomoData", ({ pomoData }) => {
    chrome.action.setBadgeText({ text: pomoData.minutes.toString() });
  });

  console.log(currentTimer);
  // count down every second, when a minute is up, countdown one minute
  // when time reaches 0:00, reset
  if (seconds > 0) {
    timer = setTimeout(() => {
      countdown({ minutes, seconds, status });
    }, 1000);
  } else if (minutes > 0) {
    seconds = 60;
    minutes--;
    chrome.storage.sync.set(
      {
        pomoData: {
          seconds: seconds,
          minutes: minutes,
          countdownTimer: currentTimer,
          status,
        },
      },
      function () {
        if (!chrome.runtime.error) {
          console.log("started");
        }
      }
    );
    countdown({ minutes, seconds, status });
  }
}

//设置badge文本背景颜色
chrome.action.setBadgeBackgroundColor({ color: "#DD4A48" });
