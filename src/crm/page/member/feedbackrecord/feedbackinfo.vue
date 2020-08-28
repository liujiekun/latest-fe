<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="客户问卷" name="questionnaire">
        <member-questionnaire></member-questionnaire>
      </el-tab-pane>
      <el-tab-pane label="客户反馈" name="feedback">
        <feedback-list></feedback-list>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import FeedbackList from '@/crm/page/member/feedbackrecord/feedbacklist'
import MemberQuestionnaire from '@/crm/page/member/feedbackrecord/memberquestionnaire'
export default {
  data () {
    return {
      activeName: 'questionnaire'
    }
  },
  created () {},
  methods: {
    handleClick (tab, event) {}
  },
  components: {
    FeedbackList,
    MemberQuestionnaire
  }
}
</script>

<style scoped>

</style>
