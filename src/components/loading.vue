<template>
  <div class="loading">
    <img width="50" height="50" src="../common/images/loading.gif">
    <p class="desc">{{title}}</p>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    title: {
      type: String,
      default: '正在载入...'
    }
  }
}
</script>

<style scoped>
.loading{
  width: 100%;
  text-align: center;
}
.desc{
  line-height: 20px;
  font-size: 18px;
  color:rgba(102, 153, 204, 0.8);
}
</style>
