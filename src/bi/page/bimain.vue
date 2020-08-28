<template>
  <div class="layout_box" :class="{ 'flex_column_full_hidden': $route.meta.h }">
    <router-view class="station_layout_wrap"></router-view>
  </div>
</template>

<script>
  import session from '../../util/session'
  export default {
    mixins: [session]
  }
</script>

