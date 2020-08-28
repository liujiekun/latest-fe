<template>
  <div>
    fileUrl:{{fileUrl}}
    <hr />单图片上传
    <doc-download @downFile="downFile" :exportType="3" ref="childMethods" btnTxt="导出盘点报告"></doc-download>
<!--     <a href="http://dev4b.everjiankang.com.cn/api/global-api/global-platform/download?fileId=JdiGvTTD0Lga8KY96I6" target="_self">下载</a>
    <doc-download fileId="JdiGvTTD0Lga8KY96I6" @downFile="downFile" :exportType="3" ref="childMethods" btnTxt="导出盘点报告"></doc-download> -->
  </div>
</template>

<script>
import everUpload from '@/components/ever-upload'
import { GENERATE_UUID as U } from '@/bi/util/reportsetuuid'
import userAvator from '@/components/user/avatar'

export default {
  components: { everUpload, userAvator },
  data () {
    return {
      fileUrl: '',
      avatarPic: '',
      uploadKey: U(),
      uploadList: [],
      imageUrl: '',
      uploadAttrs1: {
        'on-success' (res) {
          this.imageUrl = res.data.fileUrl
          console.log(res, this)
        },
        'show-file-list': false,
        'list-type': 'picture-card',
        'on-preview' (res) {
        },
        'on-remove' (res) {
        }
      },
      uploadAttrs2: {},
      uploadAttrs3: {},
      uploadAttrs: {
        'on-success' (res) {
          console.log(res, this)
        },
        'on-preview' (file) {
          console.log('on-preview', file, this)
        },
        'on-remove' (file) {
          console.log('on-remove', file, this)
        },
        'before-remove' (file) {
          console.log('before-remove', file, this)
        },
        'on-exceed' (files, fileList) {
          console.log('on-exceed', files, this)
        },
        // 'file-list': [
        //   {
        //     name: 'food.jpeg',
        //     url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
        //   },
        //   {
        //     name: 'food2.jpeg',
        //     url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
        //   },
        // ],
        'show-file-list': false,
      },
    }
  },
  created () {
    this.uploadList = [
      {
        name: '509a7cab863eb25cbf551a21b1834a5f',
        url: 'http://img.demoxht.everjiankang.com.cn/509a7cab863eb25cbf551a21b1834a5f',
      },
    ]
  },
  methods: {
    downFile () {
      // 想尽一切办法拿到下载的url 例如：/file/6,a771eb351a
      let fileurl = this.$ever.filePath + 'JdiGvTTD0Lga8KY96I6'
      this.$refs.childMethods.downfile(fileurl)
    },
    exportStatus (val) {
      console.log(val, 22)
    },
    uploadSuccess: function (file) {
      console.log('file--->', file)
    },
    fileList: function (fileList) {
      this.fileUrl = fileList
      console.log('file arr---->', this.fileUrl)
    },
    changeUploadAttr () {
      this.uploadAttrs['file-list'] = [
        {
          name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
        },
        {
          name: 'food2.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
        },
      ]
      this.uploadKey = U()
    },
    triggerUpload () {
      const btn = this.$refs.upload.$refs.upload.$el.querySelector('button')
      btn.click()
    },
  },
}
</script>
