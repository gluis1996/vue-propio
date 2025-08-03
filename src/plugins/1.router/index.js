// import { setupLayouts } from "virtual:generated-layouts";
// import { createRouter, createWebHistory } from "vue-router/auto";
// import { setupGuards } from "./guards";

// function recursiveLayouts(route) {
//   if (route.children) {
//     for (let i = 0; i < route.children.length; i++)
//       route.children[i] = recursiveLayouts(route.children[i]);

//     return route;
//   }

//   return setupLayouts([route])[0];
// }

// const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   scrollBehavior(to) {
//     if (to.hash) return { el: to.hash, behavior: "smooth", top: 60 };

//     return { top: 0 };
//   },
//   extendRoutes: (pages) => [
//     ...[
//       {
//         path: "/",
//         name: "index",
//         redirect: (to) => {
//           // TODO: Get type from backend
//           const userData = useCookie("userData");
//           if (userData?.value) return { name: "dashboard" };

//           return { name: "login", query: to.query };
//         },
//       },
//     ],
//     ...[
//       ...pages,
//       ...[
//         {
//           path: "/activaciones-ont",
//           name: "activaciones-ont",
//           component: () => import("@/pages/autorize/auto.vue"),
//         },
//       ],
//     ].map((route) => recursiveLayouts(route)),
//   ],
// });

// setupGuards(router)
// export { router };
// export default function (app) {
//   app.use(router);
// }



import { setupLayouts } from "virtual:generated-layouts"
import { createRouter, createWebHistory } from "vue-router/auto"
import { setupGuards } from "./guards"
import { getAuth } from "firebase/auth"

function recursiveLayouts(route) {
  if (route.children) {
    for (let i = 0; i < route.children.length; i++)
      route.children[i] = recursiveLayouts(route.children[i])
    return route
  }

  return setupLayouts([route])[0]
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to) {
    if (to.hash) return { el: to.hash, behavior: "smooth", top: 60 }
    return { top: 0 }
  },
  extendRoutes: (pages) => [
    {
      path: "/",
      name: "index",
      redirect: (to) => {
        const user = getAuth().currentUser
        if (user) return { name: "root" }
        return { name: "login", query: to.query }
      },
    },
    ...[
      ...pages,
      {
        path: "/activaciones-ont",
        name: "activaciones-ont",
        component: () => import("@/pages/autorize/auto.vue"),
      },
      {
        path: "/orden-tecnico-instalacion",
        name: "orden-tecnico-instalacion",
        component: () => import("@/pages/generar_ot_instalacion/index.vue"),
      },
    ].map((route) => recursiveLayouts(route)),
  ],
})

setupGuards(router)

export { router }
export default function (app) {
  app.use(router)
}
