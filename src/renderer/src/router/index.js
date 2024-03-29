import { createRouter, createWebHistory } from "vue-router"
import MainMenu from "../views/MainMenu.vue"
import Login from '../views/Login.vue'
import AppSetting from '../views/AppSetting.vue'
import AuthCheck from "../utils/AuthCheck"

const isSetupConfig = (to, from, next) => {
  let appEnv = import.meta.env.RENDERER_VITE_APP_ENV
  if (AuthCheck.envTransform(appEnv) != 'local') {
    if (AuthCheck.isConfig() == 'true') {
      next()
    } else {
      next('/setting')
    }
  } else {
    next()
  }
}

const tokenGuard = (to, from, next) => {
  let appEnv = import.meta.env.RENDERER_VITE_APP_ENV
  let scope = AuthCheck.getScope()
  if (!scope && AuthCheck.envTransform(appEnv) != 'local') {
    next('/auth/login')
  } else {
    next()
  }
}

const routerGuard = (to, from, next) => {
  let appEnv = AuthCheck.envTransform(import.meta.env.RENDERER_VITE_APP_ENVIRONMENT);
  let scope = AuthCheck.getScope();

  if (scope && appEnv != "local") {
    
    try {
      if (scope) {
        const verifiedPersonalData = AuthCheck.getScope().some((item) => {
          if (item.name !== "gate-ticketing-svc") {
            return false;
          }
          return item.roles.some(
            (role) => role.roles_name === "cashier"
          );
        });
    
        if (verifiedPersonalData) {
          next()
        } else {
          localStorage.removeItem('user')
          next('/auth/login')
        }
      } else {
        localStorage.removeItem('user')
        next('/auth/login')
      }
    } catch (error) {
      console.log(error);
    }
  }
};

const routes = [
  {
    path: "/",
    name: "main_menu",
    component: MainMenu,
    beforeEnter: [isSetupConfig, tokenGuard]
  },
  {
    path: "/auth/login",
    name: "login",
    component: Login,
    beforeEnter: [isSetupConfig]
  },
  {
    path: "/setting",
    name: "setting",
    component: AppSetting
  },
  {
    path: "/:catchAll(.*)",
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
