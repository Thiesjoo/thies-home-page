<template>
  <Base color="purple" :val="getFollows">
    <font-awesome-icon :icon="['fab', 'twitch']" />
  </Base>
</template>

<script>
import { defineComponent } from "@vue/runtime-core";
import Base from "@/widgets/Base.vue";

export default defineComponent({
  methods: {
    async getFollows() {
      const fetchRes = await fetch("/api/external/twitchfollow", { credentials: "include" })
      const res = await fetchRes.json()

      return res.data
    }
  },
  components: { Base }
});
</script>