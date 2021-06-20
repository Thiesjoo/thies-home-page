const app = new Vue({
  el: '#app',
  data: {
    users: [{ name: "Name", counter: 0 }, { name: "Name", counter: 0 }, { name: "Name", counter: 0 }, { name: "Name", counter: 0 }, { name: "Name", counter: 0 }, { name: "Name", counter: 0 }, { name: "Name", counter: 0 }],
    ranks: [
      { text: "Eerste", color: "#7fd1fb" },
      { text: "Tweede", color: "#fd6470" },
      { text: "Derde", color: "#ffffff" },
      { text: "Vierde", color: "#fddc32" },
      { text: "Vijfde", color: "#a2ed56" },
      { text: "Zesde", color: "#e25ae0" },
      { text: "Zevende", color: "#9549c1" },
    ]
  }
});


(async function () {
  const resp = await fetch("api/mongo");
  const data = await resp.json();
  app.users = data.data.slice(0, 7);
})();