<template>
  <p>You should not be seing this 👀 (Page should auto redirect in a second)</p>
</template>

<script>
export default {
  created() {
    window.location.href = `https://github.com/thiesjoo/${window.location.pathname
      .replace("/gh/", "")
      .replace("/gh", "")}`;
  },
};
</script>

<style>
</style>