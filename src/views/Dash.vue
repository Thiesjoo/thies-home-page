<template>
  <div class="background"></div>

  <div class="centered">
    <div class="info">
      <h2 class="time">{{ time }}</h2>
      <h3 class="greeting">Good morning, Thies.</h3>
    </div>
  </div>

  <div class="widget">
    <div class="p-2">
      <div
        class="inline-flex items-center bg-white leading-none text-purple-600 rounded-full p-2 shadow text-teal text-sm"
      >
        <span
          class="inline-flex bg-purple-600 text-white rounded-full h-6 px-3 justify-center items-center"
        >POS</span>
        <span class="inline-flex px-2">{{ balance }}</span>
      </div>
    </div>
    <div class="p-2">
      <div
        class="inline-flex items-center bg-white leading-none text-purple-600 rounded-full p-2 shadow text-teal text-sm"
      >
        <span class="inline-flex rounded-full h-6 px-3 justify-center items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            style="transform: scale(0.5);"
          >
            <path
              d="M5.7 0L1.4 10.985V55.88h15.284V64h8.597l8.12-8.12h12.418l16.716-16.716V0H5.7zm51.104 36.3L47.25 45.85H31.967l-8.12 8.12v-8.12H10.952V5.73h45.85V36.3zM47.25 16.716v16.716h-5.73V16.716h5.73zm-15.284 0v16.716h-5.73V16.716h5.73z"
              fill="#6441a4"
              fill-rule="evenodd"
            />
          </svg>
        </span>
        <span class="inline-flex px-2">69 Live</span>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "@vue/runtime-core";

function getCurrentTime() {
  return Intl.DateTimeFormat('nl-NL', {
    hour: 'numeric',
    minute: 'numeric',
  }).format()
}

export default defineComponent({
  data() {
    return {
      interval: null,
      time: getCurrentTime(),
      balance: '...'
    }
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  mounted() {
    fetch("/api/external/via").then(x => x.json()).then(x => {
      this.balance = (x.balance / 100).toLocaleString('nl-NL', { style: "currency", 'currency': "EUR" })
    })
  },
  created() {
    this.interval = setInterval(() => {
      this.time = getCurrentTime()
    }, 1000)
  }
});
</script>

<style>
body {
  font-family: -apple-system, BlinkMacSystemFont, "Neue Haas Grotesk Text Pro",
    "Helvetica Neue", Helvetica, Arial, sans-serif !important;
  text-shadow: 0 1px 5px rgb(0 0 0 / 10%);
  color: #fff;
}

/* Momentum albums: https://www.flickr.com/photos/152977080@N03/albums/72157681812020976 */
.background {
  background: url("https://source.unsplash.com/random/1920x1080/?landscape");
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  width: 100vw;
  height: 100vh;
  z-index: -1;
}

.centered {
  height: 100vh;
}

.info {
  flex-direction: column;
}

.centered,
.info {
  display: flex;
  align-items: center;
  justify-content: center;
}

.time {
  font-size: 1050%;
  font-weight: 500;
  letter-spacing: -5px;
}

.greeting {
  font-size: 3.375rem;
  font-weight: 300;
}

.time,
.greeting {
  cursor: default;
  text-align: center;
  line-height: 1;
  padding: 0;
  margin: 0;
}

.widget {
  position: absolute;
  right: 0;
  margin: 1em;
  top: 0;
}
</style>