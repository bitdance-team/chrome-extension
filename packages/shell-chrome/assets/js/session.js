chrome.storage.sync.get('sessionid', function ({ sessionid }) {

  if (!sessionid) {
    sessionid = uuid.v4()
    console.log(sessionid)
    chrome.storage.sync.set({
      'sessionid': sessionid
    });
  }

  axios.defaults.headers.common['x-tt-session-v2'] = sessionid

  if (typeof sessionCb === 'function') {
    sessionCb()
  }
})

