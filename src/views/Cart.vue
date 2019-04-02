<template>
  <div>
     <nav-header></nav-header>
     <nav-bread>
        <span>My Cart</span>
     </nav-bread>
    
    <div class="container">
      <div class="cart">
        <div class="page-title-normal">
          <h2 class="page-title-h2"><span>My Cart</span></h2>
        </div>
        <div class="item-list-wrap">
          <div class="cart-item">
            <div class="cart-item-head">
              <ul>
                <li>产品名称</li>
                <li>价格</li>
                <li>数量</li>
                <li>总价</li>
                <li>删除</li>
              </ul>
            </div>
            <ul class="cart-item-list">
              <li v-for="item in cartList">
                <div class="cart-tab-1">
                  <div class="cart-item-check">
                    <a href="javascipt:;" class="checkbox-btn item-check-btn" :class="{'check':item.checked==='1'}" @click="editCart('check',item)">
                      <svg class="icon icon-ok">
                        <use xlink:href="#icon-ok"></use>
                      </svg>
                    </a>
                  </div>
                  <div class="cart-item-pic">
                    <img :src="'/static/'+item.productImage">
                  </div>
                  <div class="cart-item-title">
                    <div class="item-name">{{item.productName}}</div>
                  </div>
                </div>
                <div class="cart-tab-2">
                  <div class="item-price">{{item.salePrice | currency('¥')}}</div>
                </div>
                <div class="cart-tab-3">
                  <div class="item-quantity">
                    <div class="select-self select-self-open">
                      <div class="select-self-area">
                        <a class="input-sub" @click="editCart('minus',item)">-</a>
                        <span class="select-ipt">{{item.productNum}}</span>
                        <a class="input-add" @click="editCart('add',item)">+</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="cart-tab-4">
                  <div class="item-price-total">{{item.salePrice*item.productNum | currency('¥')}}</div>
                </div>
                <div class="cart-tab-5">
                  <div class="cart-item-opration" @click="delCart(item)">
                    <a href="javascript:;" class="item-edit-btn">
                      <svg class="icon icon-del">
                        <use xlink:href="#icon-cart"></use>
                      </svg>
                    </a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="cart-foot-wrap">
          <div class="cart-foot-inner">
            <div class="cart-foot-l">
              <div class="item-all-check">
                <a href="javascipt:;">
                  <span class="checkbox-btn item-check-btn" :class="{'check':checkAllFlag}" @click="checkAll">
                      <svg class="icon icon-ok"><use xlink:href="#icon-ok"/></svg>
                  </span>
                  <span>全选</span>
                </a>
              </div>
            </div>
            <div class="cart-foot-r">
              <div class="item-total">
                总合计: <span class="total-price">{{totalPrice | currency('¥')}}</span>
              </div>
              <div class="btn-wrap">
                <a class="btn btn--red" :class="{'btn--dis':totalPrice===0}" @click="checkOut">结账</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <nav-footer></nav-footer>
    <modal :mdShow="isCartDel" @close="closeModal">
      <div slot="message">你确定要删除此条数据吗？</div>
      <div slot="btnGroup"><a href="javascript:;" class="btn--m btn" @click="delCartConfirm">确定</a>
      <a href="javascript:;" class="btn--m btn" @click="isCartDel=false">关闭</a></div>
    </modal>
  </div>
</template>
<style>
  .input-sub,.input-add{
    min-width: 40px;
    height: 100%;
    border: 0;
    color: #605F5F;
    text-align: center;
    font-size: 16px;
    overflow: hidden;
    display: inline-block;
    background: #f0f0f0;
  }
  .item-quantity .select-self-area{
    background:none;
    border: 1px solid #f0f0f0;
  }
  .item-quantity .select-self-area .select-ipt{
    display: inline-block;
    padding:0 3px;
    width: 30px;
    min-width: 30px;
    text-align: center;
  }
</style>
<script>
import '../assets/css/checkout.css'
import NavHeader from '../components/Header.vue'
  import NavFooter from '../components/Footer.vue'
  import NavBread from '../components/Bread.vue'
  import Modal from '../components/Modal.vue'
  import axios from 'axios'
  // import {currency} from '../util/currency'
    export default{
        data(){
            return{
              cartList:[],
              isCartDel:false,
              productId:'',
              productNum:''
              // checkAllFlag:false
            }
        },
        // filters:{
        //   currency:currency
        // },
        computed:{
          checkAllFlag(){
            return this.checkAccount===this.cartList.length;
          },
          checkAccount(){
            var i=0;
            this.cartList.forEach((item)=>{
                if(item.checked==='1'){
                  i++;
                }
            });
            return i;
          },
          totalPrice(){
            var money=0;
            this.cartList.forEach((item)=>{
                if(item.checked==='1'){
                  money+=parseInt(item.productNum)*parseFloat(item.salePrice);
                }
            });
            return money;
          }
        },
        components:{
          NavHeader,
          NavBread,
          NavFooter,
          Modal
        },
        mounted(){
          this.init()
        },
        methods:{
          init(){
        axios.get("/users/cartList").then((response)=>{
                 this.cartList=response.data.result;
            });
          },
          closeModal(){
            this.isCartDel=false
          },
          delCart(item){
            this.isCartDel=true,
            this.productId=item.productId,
            this.productNum=item.productNum
          },
          delCartConfirm(){
            axios.post("users/cartDel",{
              productId:this.productId
            }).then((response)=>{
                var res=response.data;
                if(res.status=='0'){
                  this.isCartDel=false,
                  this.init();
                  this.$store.commit("updateCartCount",-this.productNum);
                }
            });
          },
          editCart(flag,item){
            if(flag==='minus'){
                if(item.productNum>1){
                  item.productNum--;
                  this.$store.commit("updateCartCount",-1);
                }
            }else if(flag==='add'){
                item.productNum++;
                this.$store.commit("updateCartCount",1);
            }else if(flag==='check'){
              item.checked=item.checked==='1'?'0':'1';
            }

            axios.post('/users/editCart',{
              productId:item.productId,
              productNum:item.productNum,
              checked:item.checked
            }).then((response)=>{
              var res=response.data;
            });
          },
          checkAll(){
            //this.checkAllFlag=!this.checkAllFlag;
            var flag=!this.checkAllFlag;
            this.cartList.forEach((item)=>{
              item.checked=flag===false?'0':'1';
            });
            axios.post('users/checkAll',{
              checkAllFlag:flag===true?'1':'0'
            }).then((response)=>{
                var res=response.data
            });;
          },
          checkOut(){
            if(this.totalPrice>0){
              this.$router.push({
                path:"/address"
              });
            }
          }
        }
    }
</script>
