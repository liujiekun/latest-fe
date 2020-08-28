<template>
  <div class="child_p">
    <div v-if="grandfather.title !== '科室患者'">
      <p class="bedName" :title="father.bedName" v-if="grandfather.title === '我的患者'">
        <span v-if="!father.isChild">{{father.bedName}}</span>
      </p>
      <p
        v-if="grandfather.title === '病区患者'"
        :title="father.bedName"
        class="bq_bed_name"
      >{{father.bedName}}</p>
      <p :class="{'hoverBg':father.onlyNumber==hoverIndex}" @click="nameClick(father.onlyNumber,grandfather.title, father)" class="patientName" :title="father.patientName">{{father.patientName}}</p>
      <p style="width:42px;">
        <span v-if="father.isChild && father.position">
          <i
            v-if="father.sex==='1'||father.sex==='2'" :class="{'iconfont':true, 'icon-yingernan':father.sex==='1', 'icon-yingernv':father.sex!=='1', 'boy':father.sex==='1', 'girl':father.sex!=='1'}"
          ></i>
          <i v-else class="iconfont icon-yingerweizhi boy"></i>
          <i
            :class="{'iconfont':true, 'icon-guanlian3':father.position==='first', 'icon-guanlian4':father.position==='last', 'icon-guanlian5':father.position==='middle'}"
          ></i>
        </span>
        <span v-else>
          <span style="width:14px;">{{father.sex | formatSex}}</span>
          <i
            v-if="father.position"
            :class="{'iconfont':true, 'icon-guanlian3':father.position==='first', 'icon-guanlian4':father.position==='last', 'icon-guanlian5':father.position==='middle'}"
          ></i>
        </span>
      </p>
      <p v-if="father.source" class="source">
        <span v-if="father.source === 1">新入</span>
        <span v-if="father.source === 2">转科</span>
        <span v-if="father.source === 3">转病区</span>
        <span v-if="father.source === 4">退科</span>
      </p>
      <p class="source" :title="father.oldAreaName" v-if="father.oldAreaName&&(father.source === 3)">{{father.oldAreaName}}</p>
      <p
        class="source"
        :title="father.oldProviderName"
        v-if="father.oldProviderName&&(father.source === 2)"
      >{{father.oldProviderName}}</p>
      <p v-if="out" class="out">出</p>
    </div>
    <div v-else>
      <p class="bedName" :title="grandson.bedName">{{grandson.bedName}}</p>
      <p :class="{'hoverBg':grandson.onlyNumber==hoverIndex}" @click="nameClick(grandson.onlyNumber, grandfather.title,grandson)" class="patientName" :title="grandson.patientName">{{grandson.patientName}}</p>
      <p :class="{'current_p_wadth': grandson.position!=='first'}">
        <span v-if="grandson.isChild && grandson.position">
          <i
            v-if="grandson.sex==='1'||grandson.sex==='2'" :class="{'iconfont':true, 'icon-yingernan':grandson.sex==='1', 'icon-yingernv':father.grandson!=='1', 'boy':grandson.sex==='1', 'girl':grandson.sex!=='1'}"
          ></i>
          <i v-else class="iconfont icon-yingerweizhi boy"></i>
          <i
            :class="{'iconfont':true, 'icon-guanlian3':grandson.position==='first', 'icon-guanlian4':grandson.position==='last', 'icon-guanlian5':grandson.position==='middle'}"
          ></i>
        </span>
        <span v-else>
          <span style="width:14px;">{{grandson.sex | formatSex}}</span>
          <i
            :class="{'iconfont':true, 'icon-guanlian3':grandson.position==='first', 'icon-guanlian4':grandson.position==='last', 'icon-guanlian5':grandson.position==='middle'}"
          ></i>
        </span>
      </p>
      <p v-if="grandson.status === 3" class="out">出</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ['father', 'grandfather', 'grandson', 'hoverIndex'],
  methods: {
    nameClick (index, name, value) {
      let info = {
        index: index,
        name: name,
        value: value
      }
      this.$emit('waitingclick', info)
    }
  },
  computed: {
    out () {
      let space = this.$route.matched[0].meta.space
      let father = this.father
      if (space === 'inpatient') {
        return father.status === 3 || (father.iconList && father.iconList.discharge && (father.iconList.discharge === '1' || father.iconList.discharge === '-1'))
      } else if (space === 'resident') {
        return father.status === 3
      } else {
        return false
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.child_p {
  .hoverBg {
    color: #1c7bef;
    cursor: pointer;
  }
  .current_p_wadth {
    width: 36px;
  }
  p {
    margin: 5px auto;
    float: left;
    overflow: hidden;
    i {
      font-size: 12px;
    }
    .girl {
      color: #ffa1b2;
    }
    .boy {
      color: #5dccff;
    }
    .icon-guanlian3, .icon-guanlian4, .icon-guanlian5 {
      text-align: center;
      display: -webkit-inline-box;
      -webkit-transform:scale(0.8);
    }
  }
  .patientName,
  .bedName,
  .source,
  .bq_bed_name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .bq_bed_name {
    font-weight: 600;
    width: 41px;
    margin-left: 10px;
  }
  .source {
    width: 45px;
  }
  .patientName {
    font-weight: 600;
    margin-left: 10px;
    width: 60px;
  }
  .bedName {
    font-weight: 600;
    margin-left: 10px;
    width: 59px;
  }
  .out {
    width: 15px;
    height: 15px;
    border: 1px solid #DCDCDC;
    border-radius: 50%;
    text-align: center;
    line-height: 15px;
    background-color: #DCDCDC;
    color: #A9A9A9;
  }
}
</style>

