<template>
    <div>
    	<nav-header></nav-header>
    	<nav-bread></nav-bread>
        <div class="container">
          <div class="checkout-addr">
            <div class="page-title-normal">
              <h2 class="page-title-h2"><span>结账</span></h2>
            </div>
            <!-- process step -->
            <div class="check-step">
              <ul>
                <li class="cur"><span>确认</span> 地址</li>
                <li><span>查看</span> 订单</li>
                <li><span>支</span> 付</li>
                <li><span>确认</span> 支付</li>
              </ul>
            </div>

            <!-- address list -->
            <div class="page-title-normal checkout-title">
              <h2><span>配送地址</span></h2>
            </div>
            <div class="addr-list-wrap">
              <div class="addr-list">
                <ul>
                  <li v-for="(item,index) in addressListFilter" @click="checkedIndex=index;selectedAddressId=item.addressId" :class="{'check':checkedIndex==index}">
                    <dl>
                      <dt>{{item.userName}}</dt>
                      <dd class="address">{{item.streetName}}</dd>
                      <dd class="tel">{{item.tel}}</dd>
                    </dl>
                    <div class="addr-opration addr-del">
                      <a href="javascript:;" class="addr-del-btn" @click="delAdresss(item.addressId)">
                       <svg class="icon icon-del"><use xlink:href="#icon-cart"></use></svg>
                      </a>
                    </div>
                    <div class="addr-opration addr-set-default">
                      <a href="javascript:;" class="addr-set-default-btn" v-if="!item.isDefault" @click="setDefault(item.addressId)"><i>设为默认</i></a>
                    </div>
                    <div class="addr-opration addr-default" v-if="item.isDefault">默认地址</div>
                  </li>
                 <!--  <li>
                    <dl>
                      <dt>Tom</dt>
                      <dd class="address">海淀区中关村</dd>
                      <dd class="tel">18510000000</dd>
                    </dl>
                    <div class="addr-opration addr-del">
                      <a href="javascript:;" class="addr-del-btn">
                        <svg class="icon icon-del"><use xlink:href="#icon-del"></use></svg>
                      </a>
                    </div>
                    <div class="addr-opration addr-set-default">
                      <a href="javascript:;" class="addr-set-default-btn"><i>Set default</i></a>
                    </div>
                    <div class="addr-opration addr-default">默认地址</div>
                  </li> -->
                  <li class="addr-new">
                    <div class="add-new-inner">
                      <i class="icon-add">
                        <svg class="icon icon-add"><use xlink:href="#icon-add"></use></svg>
                      </i>
                      <p>新增地址</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div class="shipping-addr-more">
                <a class="addr-more-btn up-down-btn" href="javascript:;" @click="expand" :class="{'open':this.limit>3}">
                  more
                  <i class="i-up-down">
                    <i class="i-up-down-l"></i>
                    <i class="i-up-down-r"></i>
                  </i>
                </a>
              </div>
            </div>

            <!-- shipping method-->
            <div class="page-title-normal checkout-title">
              <h2><span>配送方式</span></h2>
            </div>
            <div class="shipping-method-wrap">
              <div class="shipping-method">
                <ul>
                  <li class="check">
                    <div class="name">标准配送</div>
                    <div class="price">免费</div>
                    <div class="shipping-tips">
                      <p>Once shipped，Order should arrive in the destination in 1-7 business days</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div class="next-btn-wrap">
              <!-- <router-link class="btn btn--m btn--red" href="javascript:;" to="/orderConfirm">Next</router-link> -->
              <router-link class="btn btn--m btn--red" href="javascript:;" :to="{path:'orderConfirm',query:{'addressId':selectedAddressId}}">Next</router-link>
            </div>
          </div>
        </div>
      	<nav-footer></nav-footer>
      	<modal :mdShow="isAddressDel" @close="closeModal">
	      <div slot="message">你确定要删除此条地址吗？</div>
	      <div slot="btnGroup">
	      <a href="javascript:;" class="btn--m btn" @click="delAdresssConfirm">确定</a>
	      <a href="javascript:;" class="btn--m btn" @click="isAddressDel=false">关闭</a>
	  	  </div>
	    </modal>
    </div>
</template>
<style>
</style>
<script>
import NavHeader from '../components/Header.vue'
  import NavFooter from '../components/Footer.vue'
  import NavBread from '../components/Bread.vue'
  import Modal from '../components/Modal.vue'
  import axios from 'axios'
  export default{
      data(){
          return{
          	addressList:[],
          	limit:3,
          	checkedIndex:0,
          	isAddressDel:false,
          	addressId:'',
          	selectedAddressId:''
          }
      },
      computed:{
      	addressListFilter(){
      		return this.addressList.slice(0,this.limit);     		
      	}
      },
      components:{
          NavHeader,
          NavBread,
          NavFooter,
          Modal
        },
        mounted(){
        	this.init();
        },
        methods:{
        	init(){
        		axios.post("/users/address").then((response)=>{
        		var res=response.data;
        		if(res.status==='0'){
        			console.log(res);
        			this.addressList=res.result
        		}
        	});
        	},
        	expand(){
        		if(this.limit==3){
        			this.limit=this.addressList.length;
        		}else{
        			this.limit=3;
        		}
        	},
        	setDefault(addressId){
        		axios.post("/users/setDefault",{
        			addressId:addressId
        		}).then((res)=>{
        			if(res.data.status=='0'){
        				this.init();
        			}
        		});
        	},
        	closeModal(){
        		this.isAddressDel=false
        	},
        	delAdresss(addressId){
        		this.isAddressDel=true,
        		this.addressId=addressId
        	},
        	delAdresssConfirm(){
        		this.isAddressDel=false
        		axios.post("users/delAdresss",{
        			addressId:this.addressId
        		}).then((response)=>{
        			var res=response.data;
        			if(res.status==='0'){
        				console.log('del success');
        				this.init();
        			}
        		});
        	}
        }
  }
</script>
