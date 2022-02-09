    new Vue({
      el: '#app',
      data() {
        return {
          username: "",
          password: ""
        }
      },
      methods: {
        login() {
          if (!this.username || !this.password) {
            alert('账号和密码不能为空!')
            return
          }
          axios.post("https://qcmma8.app.cloudendpoint.cn/api/auth/login", {
            username: this.username,
            password: this.password
          }).then(res => {
            window.close()
          }).catch(err => {
            if (err.response && err.response.data)
              alert(err.response.data.msg)
            else alert("请求失败!")
          })
        },
        register() {
          if (!this.username || !this.password) {
            alert('账号和密码不能为空!')
            return
          }
          axios.post("https://qcmma8.app.cloudendpoint.cn/api/auth/register", {
            username: this.username,
            password: this.password
          }).then(res => {
            window.close()
          }).catch(err => {
            if (err.response && err.response.data)
              alert(err.response.data.msg)
            else alert("请求失败!")
          })
        }
      }
    })
