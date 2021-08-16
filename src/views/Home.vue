<template>
  <div>
    <section class="intro container">
      <h1>GuanTheThird | Thies</h1>
      <div class="buttons">
        <div class="btn" style="order: 0" id="discord_id" :title="discordID">
          <a href="#"
            ><i class="fab fa-discord"></i>GuanTheThird#<span>{{
              discordTag
            }}</span></a
          >
        </div>
        <div class="btn" style="order: 1">
          <a href="https://github.com/thiesjoo" target="_blank"
            ><i class="fas fa-terminal"></i>My Github</a
          >
        </div>
      </div>
    </section>
    <section class="about container">
      <div class="about_title">
        <h2>About</h2>
      </div>
      <div class="about_content">
        <p class="txt">
          jojo!
          <img
            src="https://cdn.betterttv.net/emote/5c0e1a3c6c146e7be4ff5c0c/2x"
          />
          Welcome on the website of Thies. This website hosts school stuff
          (PWS), linux stuff (Linuxinstall) and some random other projects
          (ElectroAPI)
        </p>
      </div>
    </section>
    <section class="info container">
      <div class="info_title">
        <h2>Projects</h2>
      </div>
      <div class="buttons">
        <div class="btn">
          <a href="https://github.com/thiesjoo/guanthebot"
            ><i class="fas fa-robot"></i>GuanTheBot</a
          >
          is a Twitch/Discord text bot. It detects typo's in certain emotes and
          uses a real time database to respond with a mocking comment. It was my
          first project which was completely tested using Jest
        </div>

        <div class="btn">
          <a href="https://github.com/thiesjoo/PWS"
            ><i class="fas fa-scroll"></i>PWS</a
          >
          is a boid simulation I did for my swarm intelligence profile paper.
          Simulation is hosted
          <a href="https://pws.thies.dev" target="_blank"> here </a>
        </div>

        <div class="btn">
          <a href="https://github.com/thiesjoo/linuxinstall"
            ><i class="fas fa-server"></i>linuxinstall</a
          >
          is a bash script that customizes and install a new ubuntu installation
          to my liking. Raw file is hosted
          <a href="https://install.thies.dev" target="_blank"> here </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { changeFavicon } from "@/helpers/favoicon";
const MyComponent = {
  name: "Home",
  data() {
    return { discordTag: "....", discordID: "...." };
  },
  async mounted() {
    try {
      const fetchResp = await fetch("api/discord_tag");
      const response = await fetchResp.json();
      this.discordTag = response.tag;
      this.discordID = response.id;
      changeFavicon(response.avatar);
    } catch (e) {
      this.discordTag = "????";
      this.discordID = "????";
    }
  },
};
export default MyComponent;
</script>
<style>
.intro {
  /* height: 400px; */
  background: #2c2f33;
  margin-top: 70px;
  text-align: center;
  padding-top: 70px;
}

.intro h1 {
  font-size: clamp(1rem, -0.875rem + 8.333vw, 3.5rem);
  color: #fff;
  font-weight: bold;
  text-transform: uppercase;
  text-align: center;
  margin-bottom: 20px;
}

.buttons {
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  align-items: center;
  justify-content: center;
}

.btn {
  margin: 10%;
  background: #7289da;
  border-radius: 5px;
  line-height: 20px;
  font-weight: bold;
  letter-spacing: 0.1em;
  padding: 25px 30px;
  max-width: 400px;
}

.btn a {
  color: #fff;
  text-decoration: none;
  font-weight: bold;
  font-size: 20px;
  text-align: center;
}

a i {
  margin-right: 0.5em;
}

.about {
  background: #23272a;
}

.about_title h2 {
  font-size: 2em;
  font-weight: bold;
  padding: 20px 0;
  text-align: center;
  color: #fff;
}

.about_title h2:before,
.about_title h2:after {
  content: "";
  display: block;
  width: 60px;
  height: 3px;
  background: #7289da;
  margin: 15px auto 10px auto;
}

.about_content .txt {
  font-size: 17px;
  color: #d2d8ea;
  line-height: 27px;
  margin: 0;

  padding: 30px 120px 78px;
}

.info {
  height: 100%;
  padding-bottom: 10%;
  background: #2c2f33;
  margin-top: 0px;
  text-align: center;
  padding-top: 70px;
}

.info_title h2 {
  font-size: 2em;
  color: #fff;
  font-weight: bold;
  text-transform: uppercase;
  text-align: center;
  margin-bottom: 70px;
}

.info h2:before,
.info h2:after {
  content: "";
  display: block;
  width: 60px;
  height: 3px;
  background: #7289da;
  margin: 15px auto 15px auto;
}

.info .btn {
  margin: 0px 30px;
  padding: 20px 10px;
}

.info .btn a {
  color: #fff;
  font-size: 14px;
  text-align: center;
  padding: 30px 0px 0px 0px;
}
</style>
