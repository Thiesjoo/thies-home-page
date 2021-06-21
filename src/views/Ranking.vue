<template>
	<div id="wrapper">
		<div id="container">
			<h1>Meeste typo's</h1>
			<ol class="podium-rank">
				<li v-for="(item, index) in users" :key="index">
					<a href="#">
						<div class="container">
							<div class="image">
								<svg
									version="1.1"
									id="place-1"
									xmlns="http://www.w3.org/2000/svg"
									xmlns:xlink="http://www.w3.org/1999/xlink"
									x="0px"
									y="0px"
									viewBox="0 0 180 180"
									enable-background="new 0 0 180 180"
									xml:space="preserve"
								>
									<path
										:fill="ranks[index].color"
										d="M124.6,90.1l4.2-0.3l0.1-4.3l4.2-0.9l-0.5-4.3l4.1-1.4l-1-4.2l3.9-1.9l-1.5-4l3.6-2.3l-2-3.8l3.3-2.8l-2.5-3.5l2.9-3.2l-2.9-3.2l2.5-3.5l-3.3-2.8l2-3.8l-3.6-2.4l1.5-4l-3.9-1.9l1-4.2l-4.1-1.4l0.5-4.3l-4.2-0.9l-0.1-4.3l-4.3-0.3l-0.6-4.3l-4.3,0.2l-1.1-4.2L114.4,9l-1.6-4l-4.1,1.3l-2.1-3.7l-3.9,1.8L100,0.8l-3.7,2.3l-3-3.1L90,2.7L86.7,0l-3,3.1L80,0.8l-2.6,3.4l-3.9-1.8l-2.1,3.7L67.3,5l-1.6,4l-4.2-0.8l-1.1,4.2L56,12.1l-0.6,4.3l-4.3,0.3L51.1,21l-4.2,0.9l0.5,4.3l-4.1,1.4l1,4.2l-3.9,1.9l1.5,4l-3.6,2.3l2,3.8l-3.3,2.8l2.5,3.5l-2.9,3.2l2.9,3.2l-2.5,3.5l3.3,2.8l-2,3.8l3.6,2.4l-1.5,4l3.9,1.9l-1,4.2l4.1,1.4l-0.5,4.3l4.2,0.9l0.1,4.3l4.3,0.3l-30.6,73.9l27.5-11.4L63.6,180L90,116.3l26.4,63.7l11.4-27.5l27.5,11.4L124.6,90.1z M90,18.9c19.1,0,34.5,15.5,34.5,34.6C124.5,72.5,109.1,88,90,88c-19.1,0-34.5-15.5-34.5-34.6C55.5,34.4,70.9,18.9,90,18.9z"
									/>
								</svg>
							</div>
							<div class="content">
								<h2>{{ ranks[index].text }}</h2>
								<h3>{{ item.name }}</h3>
								<p>{{ item.counter }} typo's</p>
							</div>
						</div>
					</a>
				</li>
			</ol>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			users: [],
			ranks: [
				{ text: "Eerste", color: "#7fd1fb" },
				{ text: "Tweede", color: "#fd6470" },
				{ text: "Derde", color: "#ffffff" },
				{ text: "Vierde", color: "#fddc32" },
				{ text: "Vijfde", color: "#a2ed56" },
				{ text: "Zesde", color: "#e25ae0" },
				{ text: "Zevende", color: "#9549c1" },
			],
		};
	},
	async mounted() {
		const resp = await fetch("api/mongo");
		const data = await resp.json();
		if (!data.data) {
			return;
		}
		this.users = data.data.slice(0, 7);
	},
};
</script>

<style scoped>
@import url(
	https://fonts.googleapis.com/css?family=Oswald:400|Raleway:400,
	700,
	400italic,
	700italic
);

*,
:before,
:after {
	box-sizing: border-box;
}

body {
	background: #1d1f20;
	color: #e5e5e5;
	font: 16px/1.25 "Raleway", sans-serif;
}

h1,
h2,
h3,
h4,
h5,
h6 {
	font-family: "Oswald", sans-serif;
	font-weight: 400;
}

#wrapper {
	margin-left: auto;
	margin-right: auto;
	max-width: 80em;
}

#container {
	float: left;
	padding: 1em;
	width: 100%;
}

/*** LIST ***/
ol.podium-rank {
	display: flex;
	list-style: none;
	padding: 0;
	text-align: center;
}

/* Listing */
ol.podium-rank > li {
	display: flex;
	flex-basis: 0;
	flex-grow: 1;
}

ol.podium-rank > li:nth-of-type(odd) {
	order: 0;
}

ol.podium-rank > li:nth-of-type(2) {
	order: -1;
}

ol.podium-rank > li:nth-of-type(4) {
	/* For every ol.podium-rank > li:nth-of-type(even) listing, 
    decrease order by 1 of previous even listing */
	order: -2;
}

ol.podium-rank > li:nth-of-type(6) {
	/* For every ol.podium-rank > li:nth-of-type(even) listing, 
    decrease order by 1 of previous even listing */
	order: -3;
}

ol.podium-rank > li * {
	transition: all 0.5s ease 0s;
}

ol.podium-rank > li > * {
	padding: 1em;
	width: 100%;
}

/* Link */
ol.podium-rank > li > a {
	color: inherit;
	text-decoration: none;
}

/* Image */
ol.podium-rank > li .image {
	height: 0;
	padding-bottom: calc((100% / 4) * 3);
	position: relative;
	width: 100%;
}

ol.podium-rank:not(:hover) > li:not(:first-of-type) .image,
ol.podium-rank:hover > li:not(:hover) .image {
	/* Blur not compatible in IE11 */
	filter: blur(0.375em);
}

ol.podium-rank:not(:hover) > li:nth-of-type(2) .image {
	/* Blur not compatible in IE11 */
	filter: blur(0.125em);
}

ol.podium-rank:not(:hover) > li:nth-of-type(3) .image {
	/* Blur not compatible in IE11 */
	filter: blur(0.25em);
}

ol.podium-rank > li .image > * {
	height: auto;
	left: 50%;
	max-height: 30%;
	max-width: 30%;
	position: absolute;
	top: 50%;
	transform: translate(-50%, -50%);
	width: 100%;
}

ol.podium-rank:not(:hover) > li:first-of-type .image > * {
	max-height: 75%;
	max-width: 75%;
}

ol.podium-rank:not(:hover) > li:nth-of-type(2) .image > * {
	max-height: 60%;
	max-width: 60%;
}

ol.podium-rank:not(:hover) > li:nth-of-type(3) .image > * {
	max-height: 45%;
	max-width: 45%;
}

ol.podium-rank > li:hover .image > * {
	max-height: 90%;
	max-width: 90%;
}

/* Content */
ol.podium-rank > li:not(:hover) .content {
	/* opacity: 0; */
	padding-top: 1em;
}

ol.podium-rank > li:hover .content {
	padding-bottom: 1em;
}

ol.podium-rank > li .content * {
	margin: 0.25em 0 0 0;
}

/*** MEDIA QUERIES ***/
@media only screen and (max-width: 50em) {
	ol.podium-rank {
		flex-direction: column;
	}

	ol.podium-rank > li {
		display: block;
		order: 1 !important;
	}
}
</style>
