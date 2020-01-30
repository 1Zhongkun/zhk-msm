<template>
  <div>
        <AppHeader>头</AppHeader>
        <AppMain>导航</AppMain>
        <AppNavbar>主题</AppNavbar>

  </div>
</template>
<script>
import AppHeader from './AppHeader';
import AppMain from './AppMain';
import AppNavbar from './AppNavbar';
export default {
    components:{AppHeader,AppMain,AppNavbar}
}
</script>

<style scoped>
.header{
    position: absolute;
    line-height: 50px;
    height: 50px;
    top: 0px;
    left: 0px;
    right: 0px;
    background-color: #2d3a4d;
}
.navbar{
    position: absolute;
    width: 230px;
    background: #545c64;
    top: 50px;
    bottom: 0px;
    left: 0px;
    overflow-y: auto;
}
.main{
    position: absolute;
    top: 50px;
    left: 230px;
    padding: 10px;
     bottom: 0px;
     right: 0px;
    overflow-y: auto;
}
</style>