import storage from '@/util/storage'

export function beforeEach (router) {
  router.beforeEach(async (to, from, next) => {
    const TOKEN = storage.getStorageByClinic('TOKEN')
    // noRequireAuth 判断是否需要token鉴权
    if (to.meta && !to.meta.noRequireAuth) {
      if (!TOKEN || TOKEN === 'null') {
        next({
          path: '/login'
        })
      } else {
        next()
      }
    } else {
      next()
    }
  })
}
