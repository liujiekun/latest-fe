<template>
  <div>
    <material-info :isClinic="true"></material-info>
  </div>
</template>
<script>
import materialInfo from '@/manages/page/material/material.info.vue'
import * as enumConfig from '@/util/common'
export default {
  data () {
    return {
      enumConfig
    }
  },
  created () {

  },
  components: {
    materialInfo
  }
}
</script>

