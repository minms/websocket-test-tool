<template>
  <div id="app">
    <el-form :inline="true">
      <el-form-item label="">
        <el-input-number v-model="clientTotal" :min="1" :max="1000" @change="handleInit"
                         placeholder="初始化连接数量"></el-input-number>
      </el-form-item>
      
      <address-config v-model="address"/>
    </el-form>
    <el-form :inline="true">
      <el-form-item label="">
        <el-input v-model="content" placeholder="批量发送内容" style="width: 400px;"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" :disabled="!content" @click="wsSend"><i class="el-icon-s-promotion"></i></el-button>
      </el-form-item>
    </el-form>
    
    <el-row :gutter="20">
      <el-col :span="colSpan" v-for="i in clientTotal" :key="i" :style="{marginBottom: clientTotal > 3 ? '20px': '0'}">
        <websocket-client :ref="'client-' + i" :index="i" :address="address"></websocket-client>
      </el-col>
    </el-row>
  </div>
</template>

<script>

  import WebsocketClient from "./components/websocket-client";
  import AddressConfig from "./components/address-config";

  export default {
    name: 'app',
    components: {AddressConfig, WebsocketClient},
    data() {
      return {
        address: '',
        clientTotal: 1,

        content: ''
      }
    },
    computed: {
      colSpan() {
        if (this.clientTotal === 1) {
          return 24;
        } else if (this.clientTotal === 2) {
          return 12;
        }
        return 8;
      }
    },
    created() {
      let total = localStorage.getItem('websocket-test-total');
      if (total > 0) {
        this.clientTotal = parseInt(total)
      }
    },
    methods: {
      handleInit() {
        localStorage.setItem('websocket-test-total', this.clientTotal);
      },
      wsSend() {
        for (let i = 1; i <= this.clientTotal; i++) {
          this.$refs['client-' + i][0].wsSend(this.content);
        }
      }
    }
  }
</script>

<style>
  html {
    margin: 0;
    padding: 0;
  }
  
  body {
    margin: 0;
    padding: 20px;
  }
  
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    width: 100%;
    overflow: hidden;
    font-size: 12px;
  }
</style>
