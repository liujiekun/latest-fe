<template>
  <div class="prescription_review">
    <prescription-review :doctorId="$store.state.currentUser.userId"></prescription-review>
  </div>
</template>

<script>
import prescriptionReview from '@/warehouse/page/prescription.review/components/prescription.review'
export default {
  data () {
    return {
    }
  },
  methods: {

  },
  mounted () {
  },
  components: {
    prescriptionReview
  },
  destroyed () {
  }
}
</script>

<style scoped>
</style>
