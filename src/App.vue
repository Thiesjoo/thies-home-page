<template>
  <div id="app">
    <header class="header">
      <div class="container">
        <nav class="header_menu">
          <ul>
            <li v-for="item in routes" :key="item.name">
              <router-link :to="item.path">{{ item.name }}</router-link>
            </li>
            <!-- <li><router-link to="/">Home</router-link></li>
            <li>
              <router-link to="/ranking">GuanTheBot Ranking</router-link>
            </li>
            <li>
              <router-link to="/users">Twitch User List</router-link>
            </li> -->
          </ul>
        </nav>
      </div>
    </header>
    <router-view style="margin-top: 80px"> </router-view>
    <footer>
      Made by
      <a href="https://github.com/Thiesjoo/" rel="noreferrer" target="_blank"
        >Me (:</a
      >.
      <a
        target="_blank"
        rel="noreferrer"
        href="https://github.com/Thiesjoo/thies-home-page"
        >Code</a
      >
      is on github. Deployment:
      <span :title="githubSHA">{{ githubSHA.slice(0, 7) }}</span>
    </footer>
  </div>
</template>

<script>
import { defineComponent } from "@vue/runtime-core";
import { routes } from "./router/routes";

export default defineComponent({
  data() {
    return { githubSHA: ".......", routes };
  },
  async mounted() {
    try {
      const fetchResp = await fetch("api/github_data");
      const response = await fetchResp.json();
      if (response.sha) this.githubSHA = response.sha;
    } catch (e) {
      this.githubSHA = "???????";
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler(to, from) {
        document.title = to.name || "thies.dev";
      },
    },
  },
});
</script>

<style>
/*Fonts*/
@import url("https://fonts.googleapis.com/css?family=Montserrat:300,400,700&display=swap");

/*Base*/
* {
  margin: 0;
  padding: 0;
  border: 0;
  box-sizing: border-box;
  font: 100%;
  font-weight: normal;
  outline: none;
  vertical-align: baseline;
}

body {
  height: 800px;
  background: #99aab5;
  font-family: "Montserrat", sans-serif;
}

.container {
  max-width: 80%;
  margin: 0 auto;
  padding: 0;
  position: relative;
}

@media only screen and (max-width: 1000px) {
  .container {
    max-width: 95%;
  }
}

footer {
  width: 100%;
  text-align: center;
  position: fixed;
  left: 0;
  bottom: 0;
}

.header {
  position: fixed;
  top: 0px;
  width: 100%;
  background: #23272a;
  padding: 15px 0;
  z-index: 10;
}

.header_menu {
  text-align: center;
}

.header_menu ul {
  list-style-type: none;
}

.header_menu ul li {
  display: inline-block;
  margin: 10px;
}

.header_menu ul li a {
  color: #fff;
  font-weight: bold;
  text-transform: uppercase;
  text-decoration: none;
  font-size: 14px;
  line-height: 20px;
}
</style>
