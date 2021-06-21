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
				</p>
			</div>
		</section>
	</div>
	<!-- <section class="info container">
  <div class="info_title">
    <h2>Meer informatie</h2>
  </div>
  <div class="buttons">
    <div class="btn">
      <a href="#"><i class="fas fa-star"></i>asd</a>
    </div>
    <div class="btn">
      <a href="#"><i class="fas fa-headset"></i> asd2</a>
    </div>
  </div>
</section> -->
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
	text-transform: uppercase;
	font-weight: bold;
	letter-spacing: 0.1em;
	padding: 25px 30px;
}

.btn a {
	color: #fff;
	text-decoration: none;
	font-weight: bold;
	font-size: 21px;
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
	height: 346px;
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
