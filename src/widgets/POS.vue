<template>
  <Base color="blue" :val="getBalance">POS</Base>
</template>

<script>
import { defineComponent } from "@vue/runtime-core";
import Base from "@/widgets/Base.vue";

export default defineComponent({
  methods: {
    async getBalance() {
      const fetchRes = await fetch("/api/external/via")
      const res = await fetchRes.json()

      return (res.balance / 100).toLocaleString("nl-NL", { style: "currency", "currency": "EUR" });
    }
  },
  components: { Base }
});
</script>