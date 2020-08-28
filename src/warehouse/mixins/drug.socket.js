/*
  修改库房发药流程和处方审核配置需要提示用户刷新
*/
import { wsConnect } from '@/util/common/'
import getStorage from '@/warehouse/page/storages/util/getstorage.js'
const WS_CLIENT = [ // 所有socket 配置项
  {
    mate: 2,
    socketKey: '/exchange/exchange.thc-warehouse.business.send_durg_process_notify/routingKey.thc-warehouse.business.send_durg_process_notify',
    name: '修改发药流程通知'
  },
  {
    mate: 1,
    socketKey: '/exchange/exchange.thc-warehouse.business.send_system_setting_exmaine_notify/routingKey.thc-warehouse.business.send_system_setting_exmaine_notify',
    name: '修改处方审核通知'
  }
]

export default {
  mixins: [getStorage],
  data () {
    return {
      wsClient: [],
      newReload: false,
      offDialog: false
    }
  },
  beforeDestroy () {
    this.closeWsClient()
  },
  methods: {
    // 修改配置刷新当前页面
    reloadPage (sockets, routerPath, res) {
      const result = res.body && JSON.parse(res.body)
      if (!result || !result.body || !result.body.storageRoomIds || !result.body.storageRoomIds.includes(this.storageId)) return
      const thisPath = this.$route.path.indexOf('/storages/hospitaludd') > -1 || this.$route.path.indexOf('/storages/outpaitent') > -1 || this.$route.path.indexOf('/storages/home') > -1
      let path = this.$route.path.split('/')
      if (this.offDialog) return
      if (thisPath) {
        this.$alert('库房配置已被修改,将刷新页面', '提示', {
          confirmButtonText: '确定',
          type: 'warning',
          showClose: false
        }).then(() => {
          if (sockets.mate === 1) {
            if (path[path.length - 1] === 'prescriptionaudit') {
              path.splice(path.length - 1, 1)
              this.$router.replace('/storages/home')
            }
          } else {
            this.$router.replace('/storages/home')
          }
          location.reload()
          this.offDialog = false
        })
      } else {
        this.$confirm('库房配置已被修改，“确定”将返回首页并刷新页面。“取消”可继续操作完当前页面后，自行刷新页面。', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.$router.push('/storages/home')
          location.reload()
          this.offDialog = false
        }).catch(() => {
          this.newReload = true
        })
      }
      this.offDialog = true
    },
    closeWsClient () {
      if (this.wsClient) {
        this.wsClient.forEach(item => {
          item.disconnect && item.disconnect(rs => {
            this.wsClient = []
            console.log('连接已断开')
          })
        })
      }
    },
    createSocketClient (routerPath) {
      const self = this
      this.closeWsClient()
      const ws = WS_CLIENT.filter(row => row.mate)
      if (ws) {
        ws.forEach(item => {
          let wsObject = wsConnect(item.socketKey, (client, res) => {
            res && res.body && this.reloadPage(item, routerPath, res)
          })
          wsObject.then(res => {
            self.wsClient.push(res)
          })
        })
      }
    },
  },
  watch: {
    '$route': {
      handler: function (route) {
        const { path } = route
        if (path.indexOf('/storages/') > -1) {
          // 修改过库房配置并没有刷新，重新进入到首页并刷新页面
          if (this.newReload) {
            this.newReload = false
            this.$router.replace('/storages/home')
            location.reload()
          }
          // 开启库房配置修改监控
          const routes = path.split('/')
          !this.wsClient.length && this.createSocketClient && this.createSocketClient(routes[routes.length - 1])
        } else {
          this.closeWsClient && this.closeWsClient()
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    processConfig () {
      return this.$store.state.processConfig || {}
    },
    currentProcessConfig () { // 当前库房流程配置数据
      return this.processConfig.thisStorageroomProcessConfig || {}
    },
    storageroomSystemConfig () { // 库房系统设置
      return this.processConfig.storageroomSystemConfig || {}
    },
    dispenseSetting () { // 1 多库房 2 分库房
      return this.storageroomSystemConfig.dispenseSetting
    },
  },
}
