<template>
	<Base :loaded="true">
		<template #content>
			<Battery :percentage="percentage" :charging="charging"></Battery>
		</template>
	</Base>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import Battery from "@/components/Battery.vue";
import { Base } from ".";

export default defineComponent({
	data() {
		return {
			charging: false,
			percentage: 100,
		};
	},
	async mounted() {
		//@ts-ignore
		const battery = await navigator.getBattery();
		this.charging = battery.charging;
		this.percentage = Math.round(battery.level * 100);

		const self = this;
		battery.addEventListener("chargingchange", function () {
			self.charging = battery.charging;
		});
		battery.addEventListener("onlevelchange", function () {
			self.percentage = Math.round(battery.level * 100);
		});
	},
	components: { Battery, Base },
});
</script>
