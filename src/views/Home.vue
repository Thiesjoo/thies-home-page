<template>
  <div class="home">
    <img
						width="56"
						height="56"
						alt="Waving frog"
						src="https://cdn.betterttv.net/emote/5c0e1a3c6c146e7be4ff5c0c/2x" />
    <h2>Hi I'm</h2>
    <h1><i>Thies</i></h1>
    <p>Feel free to check out my <a href="https://github.com/Thiesjoo">projects</a> on Github.</p>
<br/>
    <p>Contact me at <b>contact <i>at</i> thies.dev</b></p>

    <div class="bottom">
      <p>nothing more to see here</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
});
</script>
<style>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

h1 {
  font-size: 3.5rem;
}

a {
  color: #007bff;
  text-decoration: none;
}

b {
  font-weight: bold;
}

.bottom {
  position: absolute;
  bottom: 1em;
  width: 100%;
  text-align: center;


  font-size: 0.3rem;
}
</style>
