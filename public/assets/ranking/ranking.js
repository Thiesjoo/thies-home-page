const app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    users: [{ name: "test" }, { name: "othertest" }],
    ranks: [
      { text: "First", color: "" },
    ]
  }
})