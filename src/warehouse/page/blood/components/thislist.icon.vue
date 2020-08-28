<template>
  <div class="fontcolor" :style="{background: FONT_COLOR_ICON[thisIndex]}">
  </div>
</template>

<script>
const FONT_COLOR_ICON = [
  '#DA107B',
  '#644591',
  '#F3841C',
  '#3FAFB2',
  '#0077B1',
  '#EC5B7A',
  '#5CBC2C',
  '#1C7BEF',
  '#DA107B',
  '#EBCF2E',
  '#DA107B',
  '#644591',
  '#F3841C',
  '#3FAFB2',
  '#0077B1',
  '#EC5B7A',
  '#5CBC2C',
  '#1C7BEF',
  '#DA107B',
  '#EBCF2E'
]
export default {
  props: ['thisIndex'],
  data () {
    return {
      FONT_COLOR_ICON
    }
  }
}
</script>

<style scoped lang="scss">
.fontcolor{
  width: 10px;
  height: 10px;
  margin-right: 5px;
  display: inline-block;
}
</style>
