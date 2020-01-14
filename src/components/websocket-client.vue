<template>
  <el-card class="websocket-client">
    <div slot="header" style="font-weight: bold;font-size: 14px;">第<b>{{ index }}</b>个客户端
      <span class="el-icon-open green" v-if="isConnected"></span>
      <span class="el-icon-turn-off gray" v-if="!isConnected"></span>
      <address-config v-model="addressCustom" @change="handleAddressChange" style="float: right;" type="link" :index="index">{{ connectionAddress ||
        '配置连接' }}
      </address-config>
    </div>
    <div class="messages" ref="messages">
      <div class="message" v-for="(message, i) in messages" :key="i">
        <div class="user" :class="message.user === 'server' ? 'server' : ''">{{ message.user === 'server' ? '服务器' : '我'
          }} ({{ message.time }})
        </div>
        <div class="content">{{ message.data }}</div>
      </div>
      
      <div style="line-height: 20px;font-size: 10px; color: gray;text-align: center;">--- 已是最后一条消息 ---</div>
    </div>
    <div class="toolbar">
      <el-row :gutter="20">
        <el-col :span="21">
          <el-input type="input" placeholder="请输入内容" v-model="content">
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" :disabled="!isConnected || !content" @click="wsSend(null)"><i
              class="el-icon-s-promotion"></i></el-button>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
  import AddressConfig from "./address-config";

  export default {
    name: "websocket-client",
    components: {AddressConfig},
    props: ['index', 'address'],
    data() {
    return {
      addressCustom: '',
      content: '',

      messages: [],

      connectionAddress: null,
      client: null,
      isConnected: false,
      isConnecting: false,
    }
  },
    watch: {
      address: {
        immediate: true,
        handler(val) {
          this.connectionAddress = this.addressCustom || val;
          this.connectionAddress && this.connection();
        }
      },
      addressCustom: {
        immediate: true,
        handler(val) {
          this.connectionAddress = this.addressCustom || val;
          this.connectionAddress && this.connection();
        }
      },
    },
    mounted() {
      this.updateMessagesScroll();
      this.connectionAddress = this.addressCustom || this.address;
    },
    beforeDestroy() {
      console.log('beforeDestroy')
    },
    methods: {
      updateMessagesScroll() {
        setTimeout(() => {
          this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight + 100
        }, 50);
      },
      handleAddressChange() {
        this.connectionAddress = this.addressCustom || this.address;
        this.client && this.client.close();
        this.isConnecting = this.isConnected = false;
        this.connection();
      },
      connection() {
        if (this.isConnecting || this.isConnected) {
          return;
        }
        if (!this.connectionAddress) {
          return;
        }
        this.isConnecting = true;
        this.client = new WebSocket(this.connectionAddress);
        // 监听socket连接
        this.client.onopen = this.wsOpen;
        // 监听socket错误信息
        this.client.onerror = this.wsError
        // 监听socket消息
        this.client.onmessage = this.wsMessage
        // 监听销毁
        this.client.onclose = this.wsClose
      },

      wsOpen(evt) {
        this.isConnecting = false;
        this.isConnected = true;
      },
      wsError(evt) {
        this.isConnecting = false;
        this.isConnected = false;
      },
      wsMessage(evt) {
        this.pushMessage('server', evt.data);
      },
      wsClose(evt) {
        this.isConnecting = false;
        this.isConnected = false;
      },
      wsSend(message = null) {
        if (!this.isConnected) {
          return;
        }

        let data = message || this.content;
        data = data.replace('{index}', this.index);

        this.client.send(data);
        this.pushMessage('user', data);
      },
      pushMessage(user, data) {
        let d = new Date();
        this.messages.push({
          user: user,
          data: data,
          time: d.toLocaleTimeString()
        });
        this.updateMessagesScroll();
      }
    }
  }
</script>

<style scoped>
  .messages {
    height: 200px;
    overflow-y: scroll;
    background-color: #efefef;
    padding: 5px 8px 0;
    border-radius: 5px;
  }
  
  .messages::-webkit-scrollbar {
    display: none
  }
  
  .user {
    color: red;
  }
  
  .user.server {
    color: dodgerblue;
  }
  
  .message:not(:last-child) {
    margin-bottom: 5px;
  }
  
  .toolbar {
    margin-top: 10px;
    text-align: center;
  }
  
  .green {
    float: right;
    color: green;
    font-size: 14px;
    margin: 5px 0 5px 20px;
  }
  
  .gray {
    float: right;
    color: gray;
    font-size: 14px;
    margin: 5px 0 5px 20px;
  }
</style>