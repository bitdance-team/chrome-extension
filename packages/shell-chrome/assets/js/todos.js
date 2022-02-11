
let app = new Vue({
      data() {
        return {
          todos: [],
          todoForm: "",
        }
      },
      methods: {
        loadTodos () {
          axios.get("https://qcmma8.app.cloudendpoint.cn/api/memos?pageSize=100").then(res => {
            this.todos = res.data.content
          })
        },
        createTodo () {
          if (!this.toDoForm.trim()) {
            alert('内容不能为空')
            return
          }
          axios.post("https://qcmma8.app.cloudendpoint.cn/api/memos", { content: this.toDoForm }).then(() => {
            alert('添加成功!')
            this.loadTodos()
            this.toDoForm = ""
          })
        },
        removeTodo(id) {
          axios.delete(`https://qcmma8.app.cloudendpoint.cn/api/memos/${id}`, {
            content: this.toDoForm
          }).then(() => {
            alert('删除成功!')
            this.loadTodos()
          })
        },
      },
      mounted () {
        this.loadTodos()
      }
    })

function sessionCb() {
  app.$mount('#app')
}
