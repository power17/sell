<template>
  <div class="food" v-show="showFlag" transition="move" v-el:food>
    <div class="food-content">
      <div class="image-header">
        <img :src="food.image" alt="">
        <div class="back" @click="hide">
          <i class="icon-arrow_lift"></i>
        </div>
      </div>
      <div class="content">
        <h1 class="title">{{food.name}}</h1>
        <div class="detail">
          <span class="sell-count">月售{{food.sellCount}}分</span>
          <span class="rating">好评率{{food.rating}}%</span>
        </div>
        <div class="price">
          <span class="now">¥{{food.price}}</span><span v-show="food.oldPrice" class="old">¥{{food.oldPrice}}</span>
        </div>
        <div class="cart-control-wrapper">
          <cartcontrol :food="food"></cartcontrol>
        </div>
        <div @click.stop.prevent="addFirst" class="buy" v-show="!food.count||food.count===0" transition="fade">加入购物车
        </div>
      </div>
      <split v-show="food.info"></split>
      <div class="info" v-show="food.info">
        <h1 class="title">商品信息</h1>
        <p class="text">{{food.info}}</p>
      </div>
      <split></split>
      <div class="rating">
        <h1 class="title">商品评价</h1>
        <ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc"
                      :ratings="food.ratings"></ratingselect>
        <div class="rating-wrapper">
          <ul v-show="food.ratings && food.ratings.length">
            <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings"
                class="rating-item border-1px">
              <div class="user">
                <span class="name">{{rating.username}}</span>
                <img class="avatar" width="12" height="12" :src="rating.avatar">
              </div>
              <div class="time">{{rating.rateTime | formatDate}}</div>
              <p class="text">
                <span
                  :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
              </p>
            </li>
          </ul>
          <div class="no-ratings" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import Vue from 'vue';
  // 时间戳转换模块
  import {formatDate} from 'common/js/date';
  // 引入商品评价模块
  import ratingselect from 'components/ratingselect/ratingselect';
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  import split from 'components/split/split';

  // 评价分类常量
  //    const POSITIVE = 0;
  //    const NEGATIVE = 1;
  const ALL = 2;
  export default {
    props: {
      food: {
        type: Object
      }
    },
    data() {
      // 评价页数据
      return {
        // 评价分类 2为全部 1为推荐 0为吐槽
        showFlag: false,
        selectType: ALL,
        onlyContent: true,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      };
    },
    methods: {
      // 显示商品详情页
      show() {
        this.showFlag = true;
        // 显示全部评论
        this.selectType = ALL;
        // 只看内容评价按钮打勾 true代表不√
        this.onlyContent = false;
        // 商品详情页滚动
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$els.food, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      // 隐藏商品详情页
      hide() {
        this.showFlag = false;
      },
      // 加入购物车按钮的点击
      addFirst(event) {
        if (!event._constructed) {
          return;
        }
        // 改变this.food的值实现动画
        this.$dispatch('cart.add', event.target);
        Vue.set(this.food, 'count', 1);
      },
      // 根据ratingselect子组件传过来（代码下方events）按要求显示
      needShow(type, text) {
        // 只看评论
        if (this.onlyContent && !text) {
          return false;
        }
        // 全部
        if (this.selectType === ALL) {
          return true;
        } else {
          // 根据类型显示
          return type === this.selectType;
        }
      }
    },
    events: {
      // 监听事件ratingselect的选项类型变化
      'ratingtype.select'(type) {
        this.selectType = type;
        // 防止scroll回弹
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      // 监听事件ratingselect的只看内容参数变化
      'content.toggle'(onlyContent) {
        this.onlyContent = onlyContent;
        // 防止scroll回弹
        this.$nextTick(() => {
          // 重新计算
          this.scroll.refresh();
        });
      }
    },
    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    components: {
      cartcontrol,
      split,
      ratingselect
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .food
    position fixed
    left 0
    top 0
    bottom 48px
    z-index 30
    width: 100%
    background: #fff
    &.move-transition
      transition all 0.2s linear
      transform translate3d(0, 0, 0)
    &.move-enter, &.move-leave
      transform translate3d(100%, 0, 0)
    .image-header
      position relative
      /*技术点！让图片div占位*/
      width 100%
      height 0
      padding-top 100%
      img
        position absolute
        top 0
        left 0
        width 100%
        height 100%
      .back
        position absolute
        top 10px
        left 0
        .icon-arrow_lift
          display block
          padding 18px
          font-size 20px
          color #fff
    .content
      position relative
      padding 18px
      .title
        line-height 14px
        margin-bottom 8px
        font-weight700
        font-size 14px
        color rgb(7, 17, 27)
      .detail
        margin-bottom 18px
        line-height 10px
        height 10px
        font-size 0
        .sell-count, .rating
          font-size 10px
          color rgb(147, 153, 159)
        .sell-count
          margin-right 12px
      .price
        font-weight 700
        line-height 24px
        .now
          margin-right 8px
          font-size 14px
          color rgb(240, 20, 20)
        .old
          text-decoration line-through
          font-size 10px
          color rgb(147, 153, 159)

      .cart-control-wrapper
        position absolute
        right 12px
        bottom 12px
      .buy
        position absolute
        right 18px
        bottom 18px
        z-index 10
        height 24px
        line-height 24px
        padding 0 12px
        box-sizing border-box
        border-radius 12px
        font-size 10px
        color #fff
        background rgb(0, 160, 220)
        &.fade-transition
          transition all 0.2s
          opacity 1
        &.fade-enter, &.fade-leave
          opacity 0
    .info
      padding 18px
      .title
        line-height 14px
        margin-bottom 6px
        font-size 14px
        color rgb(7, 17, 27)
      .text
        line-height 24px
        padding 0 8px
        font-size 12px
        color rgb(77, 85, 93)
    .rating
      padding-top 18px
      .title
        line-height 14px
        margin-left 18px
        font-size 14px
        color rgb(7, 17, 27)
      .rating-wrapper
        padding 0 18px
        .rating-item
          position relative
          padding 16px 0
          border-1px(rgba(7, 17, 27, .1))
          .user
            position absolute
            right 0
            top 16px
            font-size 0
            line-height 12px
            .name
              display inline-block
              margin-right 6px
              vertical-align top
              font-size 10px
              color rgb(147, 153, 159)
            .avatar
              border-radius 50%

          .time
            margin-bottom 6px
            line-height 12px
            font-size 10px
            color rgb(147, 153, 159)
          .text
            line-height 16px
            font-size 12px
            color rgb(7, 17, 27)
            .icon-thumb_up, .icon-thumb_down
              margin-right 4px
              line-height 24px
              font-size 12px
            .icon-thumb_up
              color rgb(0, 160, 220)
            .icon-thumb_down
              color rgb(147, 153, 159)
        .no-rating
          padding 16px 0
          font-size 12px
          color rgb(147, 153, 159)
</style>
