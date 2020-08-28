import {warehouse as axios} from '@/warehouse/store/api'

// 血液品种
function BLOOD_TYPE () {
  return selectDataResult('PRL18090600001zy3R8')
}
// ABO血型
function BLOOD_ABO () {
  return selectDataResult('PRL18090600002zyKsz')
}
// Rh血型
function BLOOD_RH () {
  return selectDataResult('PRL18090600003zyb4C')
}
// 血量单位
function BLOOD_UNIT () {
  return selectDataResult('PRL18090600005zyhE6')
}
// 备血状态
const BLOOD_APPLY_STATUS = [
  {
    id: '900',
    name: '待备血'
  },
  {
    id: '901',
    name: '已备血'
  },
  {
    id: '902',
    name: '异常'
  },
  {
    id: '903',
    name: '医嘱撤回'
  },
  {
    id: '904',
    name: '取消'
  }
]
// 配血状态
const BLOOD_MATCHING_STATUS = [
  {
    id: '0',
    name: '全部'
  },
  {
    id: '600',
    name: '待配血'
  },
  // {
  //   id: '601',
  //   name: '初筛血源'
  // },
  {
    id: '602',
    name: '交叉配血'
  },
  {
    id: '603',
    name: '配血完成'
  },
  {
    id: '604',
    name: '已取消'
  },
  {
    id: '605',
    name: '异常关闭'
  },
  {
    id: '606',
    name: '系统自动关闭'
  }
]
// 取血状态
const BLOOD_OUTPUT_STATUS = [
  {
    id: '0',
    name: '全部'
  },
  {
    id: '610',
    name: '新建'
  },
  {
    id: '611',
    name: '出库完成'
  },
  {
    id: '612',
    name: 'PDA签收'
  },
  {
    id: '613',
    name: '撤销'
  },
  {
    id: '614',
    name: '取血失败'
  }
]
// 取血单类型
const BLOOD_OUTPUT_TYPE = [
  {
    id: '811',
    name: '紧急用血'
  },
  {
    id: '810',
    name: '医嘱用血'
  }
]
// 正定
const matchingForwardTyping = [
  {
    id: 'A',
    name: 'A'
  },
  {
    id: 'B',
    name: 'B'
  },
  {
    id: 'AB',
    name: 'AB'
  },
  {
    id: 'O',
    name: 'O'
  }
]
// 反定
const matchingReverseTyping = [
  {
    id: 'A',
    name: 'A'
  },
  {
    id: 'B',
    name: 'B'
  },
  {
    id: 'AB',
    name: 'AB'
  },
  {
    id: 'O',
    name: 'O'
  }
]
// 抗体筛选
const matchingAntibodyScreening = [
  {
    id: '阴性',
    name: '阴性'
  },
  {
    id: '阳性',
    name: '阳性'
  }
]
// RH
const matchingRhd = [
  {
    id: '+',
    name: '+'
  },
  {
    id: '-',
    name: '-'
  }
]
//  血液品种编码枚举值
const BLOOD_TYPE_CODE = [
  {
    id: ['P0173V00'],
    name: '病毒灭活冰冻血浆',
    dateType: 'year',
    date: 4
  },
  {
    id: [],
    name: '冰冻血浆'
  },
  {
    id: ['P0147VA0'],
    name: '新鲜冰冻血浆',
    dateType: 'year',
    date: 1
  },
  {
    id: [],
    name: '冰冻解冻去甘油红细胞'
  },
  {
    id: [],
    name: '冷沉淀凝血因子'
  },
  {
    id: [],
    name: '全血'
  },
  {
    id: [],
    name: '单采新鲜冰冻血浆'
  },
  {
    id: ['P0056V00'],
    name: '悬浮红细胞',
    dateType: 'day',
    date: 35
  },
  {
    id: [],
    name: '冰冻红细胞'
  },
  {
    id: [],
    name: '去白细胞全血'
  },
  {
    id: [],
    name: '单采血小板'
  },
  {
    id: [],
    name: '去白细胞单采血小板'
  },
  {
    id: [],
    name: '浓缩血小板'
  },
  {
    id: ['P0065H00'],
    name: '去白细胞悬浮红细胞',
    dateType: 'day',
    date: 35
  }
]

//  血型ABO编码枚举值
const BLOOD_ABO_CODE = [
  {
    id: ['6200', '6600', '600'],
    name: 'A'
  },
  {
    id: ['7300', '7700', '1700'],
    name: 'B'
  },
  {
    id: ['5100', '5500', '9500'],
    name: 'O'
  },
  {
    id: ['8400', '8800', '2800'],
    name: 'AB'
  }
]
//  血型ABO编码枚举值
const BLOOD_RH_CODE = [
  {
    id: ['6200', '6600', '7300', '7700', '5100', '5500', '8400', '8800'],
    name: '+(阳)'
  },
  {
    id: ['600', '1700', '9500', '2800'],
    name: '-(阴)'
  }
]
async function selectDataResult (code) {
  if (code) {
    let path = '/basesource/getSourceByPropertyInfo/'
    return axios.post(path, {code: code}).then(result => {
      if (Array.isArray(result)) {
        let arr = []
        result.forEach(item => {
          arr.push(item.propertyValueObject)
        })
        return arr
      }
    })
  }
}

export default {
  BLOOD_TYPE,
  BLOOD_ABO,
  BLOOD_RH,
  BLOOD_UNIT,
  BLOOD_MATCHING_STATUS,
  BLOOD_OUTPUT_STATUS,
  matchingForwardTyping,
  matchingReverseTyping,
  matchingAntibodyScreening,
  matchingRhd,
  BLOOD_TYPE_CODE,
  BLOOD_ABO_CODE,
  BLOOD_RH_CODE,
  BLOOD_OUTPUT_TYPE,
  BLOOD_APPLY_STATUS
}
