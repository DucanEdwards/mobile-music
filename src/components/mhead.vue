<template>
  <div class="mhead">
    <div class="icon"></div>
    <h2 class="text">Music</h2>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'mhead'
}
</script>
<style scoped>
.mhead{
  position: relative;
  height: 44px;
  text-align: center;
  color: rgba(255,255,255,0.8);
  background: #00b894;
}
.mhead .icon{
  display: inline-block;
  vertical-align: top;
  margin-top: 6px;
  width: 30px;
  height: 32px;
  margin-right: 5px;
  border-radius: 50%;
  background-image: url("../common/images/logo.png");
  background-size: 30px 32px;

}
.mhead .text{
  display: inline-block;
  vertical-align: top;
  margin-top: 6px;
  line-height: 30px;
  font-size: 18px;
}
</style>
