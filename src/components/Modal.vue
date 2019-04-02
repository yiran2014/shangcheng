<template>
	<div>
	 	<div class="md-modal modal-msg md-modal-transition" :class="{'md-show':mdShow}">
          <div class="md-modal-inner">
            <div class="md-top">
              <button class="md-close" @click="closemodal">Close</button>
            </div>
            <div class="md-content">
              <div class="confirm-tips">
                <slot name="message"></slot>
              </div>
              <div class="login-wrap">
                <slot name="btnGroup"></slot>
              </div>
            </div>
          </div>
        </div>
        <div class="md-overlay"  v-show="mdShow" @click="closemodal">
        </div>
    </div>
</template>
<script>
export default {
  data () {
    return {
      
    }
  },
  props:["mdShow"],
  methods:{
  	closemodal(){
  		this.$emit("close");
  	}
  }
}
</script>