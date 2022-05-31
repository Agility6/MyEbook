import Vue from 'vue'
import VueRouter from 'vue-router'
import EbookReader from '../components/ebook/EbookReader.vue'


Vue.use(VueRouter)

const routes = [
  {
    path : '/',
    redirect : '/ebook'
  },
  {
    path : '/ebook',
    component : () => import('../views/ebook/index.vue'),
    children: [
      {
        path : ':fileName',
        component : EbookReader,
        props : true
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
