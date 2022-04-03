<template>
  <div class="relative" @mouseleave="open = false">
    <Base color="purple" :val="getFollows" @mouseover="open = true">
      <font-awesome-icon :icon="['fab', 'twitch']" />
    </Base>
    <!-- Dropdown menu -->
    <Transition>
      <div
        v-if="open"
        @mouseover="open = true"
        class="absolute right-0 w-48 py-2 mt-2 bg-white bg-gray-100 rounded-md shadow-xl"
      >
      
        <a
          href="#"
          class="block px-4 py-2 text-sm text-gray-300 text-gray-700 hover:bg-gray-400 hover:text-white"
          v-for="item in data"
        >{{item.id}}</a>
      </div>
    </Transition>
  </div>
</template>

<script>
import { defineComponent } from "@vue/runtime-core";
import Base from "@/widgets/Base.vue";

export default defineComponent({
  data() {
    return { open: false, data: [] }
  },
  methods: {
    async getFollows() {
      const fetchRes = await fetch("/api/external/twitchfollow", { credentials: "include" })
      if (!fetchRes.ok)
        throw new Error(fetchRes.statusText);

      const res = await fetchRes.json()
      this.data = res.data
      return res.data.length
    }
  },
  components: { Base }
});
</script>

<style scoped>
/* we will explain what these classes do next! */
.v-enter-active {
  transition: opacity 0.5s ease;
}
.v-leave-active {
  transition: opacity 0.8s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>