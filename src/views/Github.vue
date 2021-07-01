<template><p>You should not be seing this 👀</p></template>

<script>
export default {
  mounted() {
    console.log("wutface");
    window.location.href = `https://github.com/thiesjoo/${window.location.pathname
      .replace("/gh/", "")
      .replace("/gh", "")}`;
  },
};
</script>

<style>
</style>