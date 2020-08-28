/* eslint-disable */

export default {
  data () {
    return {

    }
  },
  methods: {
    resetArr () {

    },
    bloodTablefindArr(arr, blod) {
      let newArr = []
      let json = {}
      arr.map(item => {
        let id = item.matchingBatchId
        if (json[id]) {
          json[id].push(item)
        } else {
          json[id] = [item]
        }
      })
      Object.values(json).map(value => {
        newArr.push(value)
      })
      if (blod) {
        return newArr
      } else {
        let tData = []
        newArr.forEach((item, index) => {
          item.forEach(ss => {
            ss.thisIndex = index
          })
          tData = tData.concat(item)
        })
        return tData
      }
    }
  }
}