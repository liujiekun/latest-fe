<template>
  <el-upload ref="upload" v-bind="localUploadAttrs" multiple>
    <slot name="default">
      <el-button v-show="!hide" :disabled="localUploadAttrs.disabled" size="small" :type="btnType">{{btnTxt}}</el-button>
    </slot>
  </el-upload>
</template>
<script>
import storage from '@/util/storage'
import globalUrlMap from '@/login/store/globalurls'

export default {
  data () {
    return {
      hidden: false
    }
  },
  props: {
    uploadAttrs: {
      type: Object,
      default () {
        return {
        }
      }
    },
    btnType: {
      type: String,
      default: 'primary',
    },
    btnTxt: {
      type: String,
      default: '点击上传',
    },
    transfer: {
      type: Boolean,
      default: false
    },
    useMul: {
      type: Boolean,
    },
    // hide 为true时 开启功能：当文件已存在时，隐藏按钮
    hide: {
      type: Boolean
    }
  },
  computed: {
    localUploadAttrs () {
      return {
        // 默认属性
        class: 'ever-upload',
        action: this.$ever.api + '/' + globalUrlMap.phoneMapping.uploadAndCreatePhoneInfo.prefix + globalUrlMap.phoneMapping.uploadAndCreatePhoneInfo.url,
        headers: {
          'x-access-token': storage.getStorageByClinic('TOKEN'),
          ...(this.uploadAttrs.headers || {}),
        },
        // 自定义属性
        ...this.uploadAttrs,
      }
    },
    // hidden () {
    //   debugger
    //   if (this.hide) {
    //     if (this.uploadAttrs.fileList && this.uploadAttrs.fileList.length) {
    //       return true
    //     } else if (this.uploadAttrs['file-list'] && this.uploadAttrs['file-list'].length) {
    //       return true
    //     }
    //   }
    //   return false
    // },
  },
  // data () {
  //   return {
  //     localUploadAttrs: this.getUploadAttrs(this.uploadAttrs)
  //   }
  // },
  // watch: {
  //   uploadAttrs: {
  //     handler (v) {
  //       console.log(this.uploadAttrs, 'changed')
  //       this.hidden = false
  //       if (this.hide) {
  //         if (this.uploadAttrs.fileList && this.uploadAttrs.fileList.length) {
  //           this.hidden = true
  //         } else if (this.uploadAttrs['file-list'] && this.uploadAttrs['file-list'].length) {
  //           this.hidden = true
  //         }
  //       }
  //       this.hidden = false
  //     },
  //     deep: true
  //   }
  // },
  // methods: {
  //   getUploadAttrs (uploadAttrs) {
  //     return {
  //       // 默认属性
  //       class: 'ever-upload',
  //       action: `${diction.api}/${prefix}${uploadAttrs.multiple ? 'multiUpload' : 'upload'}`,
  //       headers: {
  //         'x-access-token': storage.getStorageByClinic('TOKEN'),
  //         ...(uploadAttrs.headers || {}),
  //       },
  //       // 自定义属性
  //       ...uploadAttrs,
  //     }
  //   }
  // }
}
</script>
