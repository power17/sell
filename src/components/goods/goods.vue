<template>
  <div class="goods">
    <div class="menu-wrapper">
      <ul>
        <li v-for="item in goods">
          <span class="text">
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="footer-wrapper"></div>
  </div>


</template>

<script type="text/ecmascript-6">
  // 设置变量
  const ERR_OK = 0;
  export default {
    prop: {
      // 发送ajax数据请求
      type: Object
    },
    data() {
      return {
        // 接收ajax变量
        goods: []
      };
    },
    created() {
      // 小图标类名
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
      // ajax
      this.$http.get('api/seller').then((response) => {
        response = response.body;
        if (response.errno === ERR_OK) {
          this.goods = response.data;
          console.log(this.goods);
        }
      });
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .goods
    display flex
    position absolute
    top 174px
    bottom 46px
    width 100%
    overflow hidden
    .menu-wrapper
      flex 0 0 80px
      width 80px
      background #f3f5f7
    .footer-wrapper
      flex 1

</style>
