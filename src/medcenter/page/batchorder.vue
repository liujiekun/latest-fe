<template>
  <div id="moreadd">
    <ever-bread-crumb :name="'体检预约'" show-edit-fnt="false" :have-return="true"></ever-bread-crumb>
    <el-card
      v-loading="loading2"
      element-loading-text="拼命上传中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)">
      <h4>第一步：下载文件模版</h4>
      <el-row>
        <el-col :span="24">
          <p>请按文件模版中的格式整理数据，否则会上传失败。</p>
          <p>文件模版：<a :href="api.downUrl">体检套餐批量下单数据模版.xlsx <el-button>下载</el-button></a></p>
        </el-col>
      </el-row>
      <h4>第二步：按文件模版整理数据</h4>
      <el-row>
        <el-col :span="24">
          <p>请按文件模版中的格式整理数据，否则会上传失败。</p>
          <p class="tit">会员数据导入数据说明：</p>
          <p class="bdy">1. 单次最多导入2000数据</p>
          <p class="bdy">2.若导入到数据姓名+手机号+身份证号，在系统存在唯一一条对应的客户信息，则补充系统中为空的字段，如详细居住地址</p>
          <p class="bdy">3. 若姓名、手机号、身份证号中有一项在系统中存在且其他项中存在一项不同，则认同为当前记录为导入失败数据。
          <p class="bdy">4. 若姓名、手机号、身份证号均在系统中不存在，则新建会员。</p>
          <p class="tit">套餐信息导入说明：</p>
          <p class="bdy">1. 有效会员：新建会员+已经存在的会员信息。</p>
          <p class="bdy">2. 校验体检套餐名称及往来单位是否正确，如不正确，则标识出错误行数。</p>
          <p class="bdy">3. 为有效会员批量下单（体检套餐名+往来单位）</p>
          <p class="bdy">4. 失败数据将以xls提供下载查询。</p>
          <div>文件模版：
            <img :src="'' | fixImgSrc(4)" class="imgconatiner">
          </div>
        </el-col>
      </el-row>
      <h4>第三步：上传整理好的文件</h4>
      <el-row>
        <el-col :span="24">
          <p>请将整理好的文件上传到系统。</p>
          <div>
            <!-- <el-upload
              action="upload"
              :show-file-list="false"
              :http-request="postFile">
              上传文件：
              <el-button><i class="icon iconfont icon-PHR-Document"></i> 选择文件</el-button>
            </el-upload> -->
             <upload-file ref="upload" @success="postFile" @change="fileList" previewInline="true"  uploadApiType="ucloud"></upload-file>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
  import api from '@/medcenter/store/batchorderapi'

  export default {
    data () {
      return {
        api,
        loading2: false
      }
    },
    created () {
    },
    methods: {
      postFile (file) {
        this.loading2 = true
        this.api.importExcelFile({'fileUrl': file.url}).then(rs => {
          console.log(rs, 'ppp')
          if (rs.head.errCode === 0) {
            // this.loading2 = false
            // 信息补充' + rs.data.appendNum + '条,
            if (rs.data.errorNum) {
              this.$confirm('导入成功, 导入数据' + rs.data.totalNum + '条, 导入成功' + rs.data.successNum + '条,  导入失败' + rs.data.errorNum + '条', {
                confirmButtonText: '下载导入报告',
                showCancelButton: false,
                type: 'success',
                center: true
              }).then(() => {
                if (rs.data.resultPath) {
                  window.open(rs.data.resultPath, '_self')// examUrl
                }
              })
            } else {
              this.$confirm('导入成功, 导入数据' + rs.data.totalNum + '条, 导入成功' + rs.data.successNum + '条,  导入失败' + rs.data.errorNum + '条', {
                showCancelButton: false,
                showConfirmButton: false,
                type: 'success',
                center: true
              })
            }
          }
          this.$refs.upload.$refs.upload.clearFiles()
          this.loading2 = false
        })
      },
      fileList () {
      }
    }
  }
</script>
<style scoped>
.imgconatiner{width:80%;}
.tit{font-weight: bold;}
.bdy{margin-left: 2em;}
</style>
