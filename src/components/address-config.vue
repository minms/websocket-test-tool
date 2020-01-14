<template>
  <div style="display: inline-block;">
    <el-button v-if="type !== 'link'" @click="showDialog">
      <slot>配置连接地址</slot>
    </el-button>
    <el-link v-if="type === 'link'" @click="showDialog">
      <slot>配置连接地址</slot>
    </el-link>
  </div>
</template>

<script>
  export default {
    name: "address-config",
    props: ['type', 'value', 'index'],
    data() {
      return {
        visible: false,
        address: null,
        cacheKey: ''
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          this.address = val;
        }
      }
    },
    created() {
      this.cacheKey = this.index === undefined ? 'websocket-test-address' : `websocket-test-address-${this.index}`
      this.loadFromStorage();
    },
    methods: {
      loadFromStorage() {
        let address = localStorage.getItem(this.cacheKey);
        if (address) {
          this.$emit('input', address);
          this.$emit('change')
        }
      },
      showDialog() {
        this.$prompt('请输入连接地址', '提示', {
          inputValue: this.address,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          // inputPattern: /[ws|wss]\:\/\/[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
          inputErrorMessage: '输入格式不正确', //ws://0.0.0.0:8080
          closeOnClickModal: false
        }).then(({value}) => {
          localStorage.setItem(this.cacheKey, value);
          this.$emit('input', value)
          this.$emit('change')
        }).catch(() => {

        });
      }
    }

  }
</script>

<style scoped>

</style>