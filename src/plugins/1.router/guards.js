// export const setupGuards = router => {
//   // 👉 router.beforeEach
//   // Docs: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
//   router.beforeEach(to => {
//     /*
//          * If it's a public route, continue navigation. This kind of pages are allowed to visited by login & non-login users. Basically, without any restrictions.
//          * Examples of public routes are, 404, under maintenance, etc.
//          */
//     if (to.meta.public)
//       return

//     /**
//          * Check if user is logged in by checking if token & user data exists in local storage
//          * Feel free to update this logic to suit your needs
//          */
//     const isLoggedIn = !!(useCookie('userData').value && useCookie('accessToken').value)

//     /*
//           If user is logged in and is trying to access login like page, redirect to home
//           else allow visiting the page
//           (WARN: Don't allow executing further by return statement because next code will check for permissions)
//          */
//     if (to.meta.unauthenticatedOnly) {
//       if (isLoggedIn)
//         return '/'
//       else
//         return undefined
//     } 
//     if (!isLoggedIn && to.matched.length) {
//       /* eslint-disable indent */
//             return isLoggedIn
//                 ? { name: 'not-authorized' }
//                 : {
//                     name: 'login',
//                     query: {
//                         ...to.query,
//                         to: to.fullPath !== '/' ? to.path : undefined,
//                     },
//                 }
//             /* eslint-enable indent */
//     }
//   })
// }


// src/plugins/1.router/guards.js
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(getAuth(), user => {
      unsubscribe()
      resolve(user)
    }, reject)
  })
}

export const setupGuards = router => {
  router.beforeEach(async to => {
    // 👉 Permitir rutas públicas
    if (to.meta?.public) return

    const user = await getCurrentUser()

    // 👉 Si la ruta es solo para NO autenticados, redirige si ya está logueado
    if (to.meta?.unauthenticatedOnly) {
      if (user) return '/'
      else return
    }

    // 👉 Si NO hay usuario autenticado, redirige a login
    if (!user && to.matched.length) {
      return {
        name: 'login',
        query: {
          ...to.query,
          to: to.fullPath !== '/' ? to.path : undefined,
        },
      }
    }
  })
}
