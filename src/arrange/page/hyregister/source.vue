<template>
  <el-row>
    <el-col :span="12">
      <el-select v-model="form.service" clearable value-key="id" placeholder="号别">
        <el-option v-for="(item, i) in serviceList" :key="i" :value="item" :label="item.name"></el-option>
      </el-select>
    </el-col>
    <el-col :span="12">
      <el-select
        v-model="form.source"
        clearable
        value-key="startTimeStr"
        class="ml10"
        placeholder="加号"
        v-if="isAdd"
      >
        <el-option
          v-for="(item, i) in timerangeList"
          :key="i"
          :value="item"
          :disabled="item.expired"
          :label="item.startTimeStr"
        ></el-option>
      </el-select>
      <el-select
        v-model="form.source"
        clearable
        value-key="startTimeStr"
        class="ml10"
        placeholder="号源"
        filterable
        v-else
      >
        <el-option
          v-for="(item, i) in timeList"
          :key="i"
          :value="item"
          :disabled="isDisabled(item)"
          :label="item.startTimeStr"
        ></el-option>
      </el-select>
    </el-col>
  </el-row>
</template>
<script>
import api from '@/arrange/store/appointapi'

export default {
  props: ['value', 'organId', 'deptId', 'resourceId', 'resourceType', 'date', 'channel', 'isAdd', 'resource', 'appointId'],
  data () {
    return {
      api,
      serviceList: [],
      timeList: [],
      tempSource: '',
      configValue: '',
      timerangeList: [],
      form: {
        service: '',
        source: '',
        isAdd: this.isAdd
      }
    }
  },
  watch: {
    'value' (val) {
      if (val) {
        this.form = val
        this.form.isAdd = this.isAdd
      }
    },
    'form': {
      handler (val) {
        this.$emit('input', val)
      },
      deep: true
    },
    'resourceId' (val, old) {
      if (val) {
        if (this.isAdd) {
          this.getBasesetServiceList()
        } else {
          this.getServiceList()
        }
      } else {
        this.form.service = ''
        this.serviceList = []
      }
    },
    'form.service' (val) {
      if (val) {
        if (this.isAdd) {
          this.getBasesetResourceTimeList()
        } else {
          this.initTimeList()
        }
      } else {
        this.form.source = ''
        this.timeList = []
      }
    },
    'isAdd' (val) {
      this.form.isAdd = val
      if (val) {
        this.getBasesetServiceList()
        this.getBasesetResourceTimeList()
      } else {
        this.getServiceList()
        this.initTimeList()
      }
    },
    'resource' (val) {
      this.form = {
        service: '',
        source: '',
        isAdd: this.isAdd
      }
    },
    'appointId' (val) {
      if (!val) {
        this.form.source = this.timeList.filter(item => {
          return !item.expired && item.sliceStockAmount > 0 && item.isValid
        })[0]
      }
    }
  },
  created () {
    this.getRuleConfigByKey()
  },
  methods: {
    getRuleConfigByKey () {
      this.api.getRuleConfigByKey({ configKey: 'IS_SELECT_LATEST_TIMESLICE' })
        .then(rs => {
          if (rs.head.errCode) {
            return false
          }
          this.configValue = rs.data ? rs.data.configValue : 0
        })
    },
    isDisabled (item) {
      let date = new Date(this.$moment().format('YYYY-MM-DD') + ' ' + item.startTimeStr).getTime()
      let now = new Date().getTime()
      return ((item.expired || item.sliceStockAmount <= 0 || item.isValid === 0) && (!item.appointmetIds || !item.appointmetIds.includes(this.appointId))) || now > date
    },
    getServiceList () {
      // this.form.source = ''
      if (!this.deptId || !this.resourceId) {
        this.form.source = ''
        this.serviceList = []
        return false
      }
      this.api.listServiceRange({
        timeTrunkType: 1,
        date: this.date || this.$moment().format('YYYY-MM-DD'),
        organId: this.organId,
        deptId: this.deptId,
        resourceId: this.resourceId
      }).then(rs => {
        if (rs.head.errCode || !rs.data[0]) {
          this.form.service = ''
          return false
        }
        this.serviceList = rs.data.map(item => {
          return { id: item.serviceId, name: item.serviceName }
        })
        if (!this.value.service || !this.serviceList.filter(item => {
          return this.value.service.serviceId === item.serviceId
        })[0]) {
          this.form.service = this.serviceList[0]
        }
        this.$emit('getServiceList', this.serviceList)
      })
    },
    initTimeList () {
      let date = this.value.source ? new Date(this.value.source.dateStr + ' ' + this.value.source.startTimeStr).getTime() : new Date().getTime()
      let now = new Date().getTime()
      if (!this.resourceId || !this.form.service.id) {
        this.timeList = []
        return false
      }
      this.api.getArrangeTime({
        isCanAppoint: false,
        timeTrunkType: 1,
        resourceId: this.resourceId,
        serviceId: this.form.service.id,
        deptId: this.deptId,
        date: this.date || this.$moment().format('YYYY-MM-DD'),
        channelId: this.channel || 1
      }).then(rs => {
        if (rs.head.errCode || !rs.data[0]) {
          this.timeList = []
          this.form.source = ''
          this.selectTime = ''
          return false
        }
        this.timeList = rs.data.map(item => {
          return {
            timesliceId: item.timesliceId,
            startTimeStr: item.startTimeStr,
            endTimeStr: item.endTimeStr,
            expired: item.expired,
            sliceStockAmount: item.sliceStockAmount,
            isValid: item.isValid,
            isCanAppoint: item.isCanAppoint,
            appointmetIds: item.appointmetIds
          }
        })
        if (now >= date) {
          this.form.source = this.timeList.filter(item => {
            return !this.isDisabled(item)
          })[0]
        }
      })
    },
    getBasesetResourceTimeList () {
      if (!this.resourceId || !this.resourceType) {
        this.timerangeList = []
        return false
      }
      this.api.getBasesetArrangeResource({
        timeTrunkType: 1,
        deptId: this.deptId,
        resourceId: this.resourceId,
        resourceType: this.resourceType
      }).then(rs => {
        this.timerangeList = []
        if (rs.head.errCode || !rs.data || !rs.data.timerangeList[0]) {
          return false
        }
        rs.data.timerangeList.map(item => {
          this.timerangeList = this.timerangeList.concat(item.timesliceVOList)
        })
        this.timerangeList = this.timerangeList.map(item => {
          return {
            timesliceId: item.id,
            startTimeStr: item.startTimeStr,
            endTimeStr: item.endTimeStr,
            expired: item.startTimeStr < this.$moment().format('HH:mm'),
            sliceStockAmount: 1,
            isValid: 1,
            isCanAppoint: 1
          }
        })
        this.form.source = this.timerangeList.filter(item => {
          return !item.expired
        })[0]
      })
    },
    getBasesetServiceList () {
      if (!this.resourceId || !this.resourceType) {
        this.serviceList = []
        return false
      }
      this.api.getBasesetArrangeResource({
        timeTrunkType: 1,
        deptId: this.deptId,
        resourceId: this.resourceId,
        resourceType: this.resourceType
      }).then(rs => {
        if (rs.data.serviceRelList) {
          this.serviceList = rs.data.serviceRelList.map(item => {
            return { id: item.serviceId, name: item.serviceName }
          })
          if (!this.value.service || !this.serviceList.filter(item => {
            return this.value.service.serviceId === item.id
          })[0]) {
            this.form.service = this.serviceList[0]
          }
        } else {
          this.serviceList = []
          this.form.service = ''
        }
        this.$emit('getServiceList', this.serviceList)
      })
    }
  }
}
</script>
