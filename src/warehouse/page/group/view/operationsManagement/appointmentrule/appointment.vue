<template>
  <div class="inner">
    <div class="middle">
      <div>
        <p>门诊客服预约</p>
        <div class="appoint">
          <label>门诊客服预约可用排班范围：可预约</label>
          <el-input-number v-model="form.numberone" style="width:60px" size="mini" :min="1" :max="999" :controls="false"></el-input-number>
          <label>日内排班,每日</label>
          <div style="display:inline">
            <el-time-select
              class="wid"
              size="mini"
              v-model="form.value1"
              :picker-options="{
                start: '00:00',
                step: '00:10',
                end: '24:00'
              }"
              placeholder="时间"
            ></el-time-select>
          </div>
          <label>开放新号源</label>
        </div>
      </div>
      <div>
        <p>门诊线上预约</p>
        <div class="appoint">
          <label>门诊线上预约可用排班范围：可预约</label>
          <el-input-number v-model="form.numbertwo" style="width:60px" size="mini" :min="1" :max="999" :controls="false"></el-input-number>
          <label>日内排班,每日</label>
          <el-time-select
            v-model="form.value2"
            size="mini"
            class="wid"
            :picker-options="{
              start: '00:00',
              step: '00:10',
              end: '24:00'
            }"
            placeholder="时间"
          ></el-time-select>
          <label>开放新号源</label>
        </div>
      </div>
      <div>
        <p>视频问诊预约</p>
        <div class="appoint">
          <label>预约可用排班范围：可预约</label>
          <el-input-number v-model="form.numberthi" style="width:60px" size="mini" :min="1" :max="999" :controls="false"></el-input-number> 
          <label>日内排班,每日</label>
          <el-time-select
            v-model="form.value3"
            size="mini"
            class="wid"
            :picker-options="{
              start: '00:00',
              step: '00:10',
              end: '24:00'
            }"
            placeholder="时间"
          ></el-time-select>
          <label>开放新号源</label>
        </div>
      </div>
      <div>
        <p>图文问诊预约</p>
        <div class="appoint">
          <label>预约可用排班范围：可预约</label>
          <el-input-number v-model="form.numberfour" style="width:60px" size="mini" :min="1" :max="999" :controls="false"></el-input-number> 
          <label>日内排班,每日</label>
          <el-time-select
            v-model="form.value4"
            size="mini"
            class="wid"
            :picker-options="{
              start: '00:00',
              step: '00:10',
              end: '24:00'
            }"
            placeholder="时间"
          ></el-time-select>
          <label>开放新号源</label>
        </div>
      </div>
    </div>
    <div class="btn">
      <el-button type="primary" class="bc" @click="submit">保存</el-button>
    </div>
  </div>
</template>
<script>
import api from '@/arrange/store/appointapi'
export default {
  data () {
    return {
      api,
      form: {
        numberone: 15,
        numbertwo: 15,
        numberthi: 15,
        numberfour: 15,
        value1: '',
        value2: '',
        value3: '',
        value4: ''
      }
    }
  },
  created () {
    this.getval()
  },
  methods: {
    getval () {
      this.api.getAppointmentRuleConfig().then(rs => {
        if (rs.head.errCode) {
          return false
        }
        if (rs.data) {
          this.form.numberone = rs.data.Customer_Appointment_Register_Rule && rs.data.Customer_Appointment_Register_Rule.day
          this.form.value1 = rs.data.Customer_Appointment_Register_Rule && rs.data.Customer_Appointment_Register_Rule.time
          this.form.numbertwo = rs.data.App_Appointment_Register_Rule && rs.data.App_Appointment_Register_Rule.day
          this.form.value2 = rs.data.App_Appointment_Register_Rule && rs.data.App_Appointment_Register_Rule.time
          this.form.numberthi = rs.data.Video_Appointment_Register_Rule && rs.data.Video_Appointment_Register_Rule.day
          this.form.value3 = rs.data.Video_Appointment_Register_Rule && rs.data.Video_Appointment_Register_Rule.time
          this.form.numberfour = rs.data.Picture_Text_Appointment_Register_Rule && rs.data.Picture_Text_Appointment_Register_Rule.day
          this.form.value4 = rs.data.Picture_Text_Appointment_Register_Rule && rs.data.Picture_Text_Appointment_Register_Rule.time
        }
      })
    },
    submit () {
      let params = {
        App_Appointment_Register_Rule: {
          day: this.form.numbertwo,
          time: this.form.value2
        },
        Customer_Appointment_Register_Rule: {
          day: this.form.numberone,
          time: this.form.value1
        },
        Video_Appointment_Register_Rule: {
          day: this.form.numberthi,
          time: this.form.value3
        },
        Picture_Text_Appointment_Register_Rule: {
          day: this.form.numberfour,
          time: this.form.value4
        }
      }
      this.api.updateAppointmentRuleConfig(params).then(rs => {
        if (rs.head.errCode) {
          return false
        }
        this.$notify({
          title: '成功',
          message: '保存成功',
          type: 'success'
        })
      })
    }

  }
}
</script>
<style scoped>
.inner {
  width: 750px;
  margin: 0 auto;
  margin-top: 50px;
}
.btn {
  margin-top: 15px;
  margin-bottom: 15px;
}
.work {
  background-color: #ffffff;
}
.middle {
  background: #ffffff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  padding: 19px;
}
input {
  width: 60px;
  height: 36px;
  margin-left: 5px;
  margin-right: 5px;
}
.wid {
  width: 80px;
  height: 36px;
  margin-left: 5px;
  margin-right: 5px;
}
p {
  margin: 0px;
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #000000;
  letter-spacing: 0.5px;
  line-height: 36px;
}
.appoint {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #333333;
  letter-spacing: 0.5px;
  line-height: 36px;
}
</style>
