import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store=new Vuex.Store({
	state:{
		nickname:'',
		cartCount:0
	},
	mutations:{
		updateNickname(state,nickname){
			state.nickname=nickname
		},
		updateCartCount(state,cartCount){
			state.cartCount +=cartCount
		},
		initCartCount(state,cartCount){
			state.cartCount =cartCount
		}
	}
})

export default store;