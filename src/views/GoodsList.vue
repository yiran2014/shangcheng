<template>
 <div>
  <nav-header></nav-header>
  <modal :mdShow="ifShow" @close="closeModal">
    <p slot="message">
      请先登录，否则无法加入购物车！
    </p>
    <div slot="btnGroup">
      <a href="javascript:;" class="btn-login" @click="ifShow=false">关闭</a>
    </div>
  </modal>
  <modal :mdShow="ifShowCard" @close="closeModal">
    <p slot="message">
      <svg class="icon-status-ok">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
      </svg>
      <span>添加购物车成功！</span>
    </p>
    <div slot="btnGroup">
      <a href="javascript:;" class="btn--m btn" @click="ifShowCard=false">继续添加</a>
<!--       <a class="btn btn--m" href="/cart">查看购物车</a>  -->
<router-link class="btn btn--m" href="javascript:;" to="/cart">查看购物车</router-link>
    </div>
  </modal>
  <nav-bread>
    <span>goods</span>
  </nav-bread>
<div class="accessory-result-page accessory-page">
  <div class="container">
    <div class="filter-nav">
      <span class="sortby">Sort by:</span>
      <a href="javascript:void(0)" class="default cur">Default</a>
      <a href="javascript:void(0)" class="price" @click="sortGoods">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
      <a href="javascript:void(0)" class="filterby stopPop">Filter by</a>
    </div>
    <div class="accessory-result">
      <!-- filter -->
      <div class="filter stopPop" id="filter">
        <dl class="filter-price">
          <dt>Price:</dt>
          <dd><a href="javascript:void(0)" @click="setPriceFilter('all')">All</a></dd>
          <!-- <dd>
            <a href="javascript:void(0)">0 - 100</a>
          </dd>
          <dd>
            <a href="javascript:void(0)">100 - 500</a>
          </dd>
          <dd>
            <a href="javascript:void(0)">500 - 1000</a>
          </dd>
          <dd>
            <a href="javascript:void(0)">1000 - 2000</a>
          </dd> -->
          <dd v-for="(item,index) in priceFilter">
            <a href="javascript:void(0)" @click="setPriceFilter(index)">{{item.startPrice | currency('¥')}} - {{item.endPrice | currency('¥')}}</a>
          </dd>
        </dl>
      </div>

      <!-- search result accessories list -->
      <div class="accessory-list-wrap">
        <div class="accessory-list col-4">
          <ul>
            <li v-for="item in goodsList">
              <div class="pic">
                <a href="#"><img :src="'static/'+item.productImage" alt=""></a>
              </div>
              <div class="main">
                <div class="name">{{item.productName}}</div>
                <div class="price">{{item.salePrice | currency('¥')}}</div>
                <div class="btn-area">
                  <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                </div>
              </div>
            </li>
          </ul>
          <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30">
  加载中...
</div>
        </div>
      </div>
    </div>
  </div>
</div>
  <nav-footer></nav-footer>
 </div>
</template>
<script>
  import '../assets/css/base.css'
  import '../assets/css/login.css'
  import '../assets/css/product.css'
  import NavHeader from '../components/Header.vue'
  import NavFooter from '../components/Footer.vue'
  import NavBread from '../components/Bread.vue'
  import axios from 'axios'
  import Modal from '../components/Modal.vue'

  export default{
    components:{
      NavHeader,
      NavFooter,
      NavBread,
      Modal
    },
    data(){
      return {
        goodsList:[],
        sortFlag:true,
        page:1,
        pageSize:8,
        busy:true,
        priceFilter:[
          {
            startPrice:'0',
            endPrice:'100'
          },
          {
            startPrice:'100',
            endPrice:'500'
          },
          {
            startPrice:'500',
            endPrice:'1000'
          },
          {
            startPrice:'1000',
            endPrice:'5000'
          }
        ],
        priceLevel:'all',
        ifShow:false,
        ifShowCard:false
      }
    },
    mounted(){
      this.getGoodsList();
    },
    methods:{
      getGoodsList(flag){
         axios.get("/goodss/list",{
          params:{
            page:this.page,
            pageSize:this.pageSize,
            sort:this.sortFlag?1:-1,
            priceLevel:this.priceLevel
          }
         }).then((response)=>{
        var res=response.data;
        if(res.status=='0'){
          if(flag){
          this.goodsList=this.goodsList.concat(res.result.list);
          if(res.result.count===0){
            this.busy=true
            console.log(99999)
          }else{
            this.busy=false
          }
        }else{
this.goodsList=res.result.list;
this.busy=false
        }
        }else{
          this.goodsList=[];
        }
      });
      },
      sortGoods(){
          this.sortFlag = !this.sortFlag;
          this.getGoodsList();
      },
      setPriceFilter(index){
        this.priceLevel=index,
        this.page=1,
        this.getGoodsList()
      },
      addCart(productId){
        axios.post("/goodss/addCart",{
            productId:productId 
        }).then((res)=>{
          if(res.data.status==="0"){
            // console.log(11111111);
          //  alert("加入成功");
          this.$store.commit("updateCartCount",1);
          this.ifShowCard=true;
          }else{
            console.log(res.data);
            //alert("msg: "+res.data.msg);
            this.ifShow=true;
          }
        });
      },
      loadMore(){
     // this.busy = false;
      console.log(11111112);
     //官方示例中延迟了1秒，防止滚动条滚动时的频繁请求数据
      setTimeout(() => {
        //这里请求接口去拿数据，实际应该是调用一个请求数据的方法
        console.log(333)
        this.page++;
        this.getGoodsList(true);

       // this.busy = false;
      }, 1000);



      },
      closeModal(){
        this.ifShow=false;
        this.ifShowCard=false;
      }

    }
  }
</script>