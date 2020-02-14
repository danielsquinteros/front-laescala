import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import Home from '../views/Home.vue'
import Login from '../components/Login.vue'
import Categoria from '../components/Categoria.vue'
import Usuario from '../components/Usuario.vue'
import Articulo from '../components/Articulo.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      administrador: true,
      dentista: true,
      asistente: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      libre: true
    }
  },
  {
    path: '/categoria',
    name: 'categoria',
    component: Categoria,
    meta: {
      administrador: true,
      dentista: true,
      asistente: true
    },
  },
  {
    path: '/usuario',
    name: 'usuario',
    component: Usuario,
    meta: {
      administrador: true,
    },
  },
  {
    path: '/articulo',
    name: 'articulo',
    component: Articulo,
    meta: {
      administrador: true,
      dentista: true,
      asistente: true
    },
  },
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.libre)){
    next();
  } else if ( store.state.usuario && store.state.usuario.rol == 'Administrador'){
    if( to.matched.some(record => record.meta.administrador)){
      next();
    }
  } else if ( store.state.usuario && store.state.usuario.rol == 'Dentista'){
    if( to.matched.some(record => record.meta.dentista)){
      next();
    }
  } else if ( store.state.usuario && store.state.usuario.rol == 'Asistente'){
    if( to.matched.some(record => record.meta.asistente)){
      next();
    }
  } else {
    next({name: 'login'});
  } 
})

export default router
