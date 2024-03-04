import Vue from 'vue';
import VueRouter from 'vue-router';
import DataVisual from './../src/components/pages/DataVisual.vue'
import OneMap from './../src/components/pages/OneMap.vue';

Vue.use(VueRouter);

export default new VueRouter({
    routes: [
        {
            path: '/',
            component: DataVisual
        },
        {
            path: '/onemap',
            component: OneMap
        },
    ],
    mode: 'history'
})
