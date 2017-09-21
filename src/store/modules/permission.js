
import { constantRouterMap,asyncRouterMap } from '../../router'

const permission = {
    state: {
        routers: constantRouterMap,
        addRouters: []
    },
    mutations: {
        SET_ROUTERS: (state,routers) => {
            state.addRouters = routers;
            state.routers = constantRouterMap.concat(routers);
        }
    },
    actions: {
        GenerateRouters({ commit },roles,permissions){
            return new Promise( resolve => {

                let accessedRouters
                accessedRouters = asyncRouterMap;
                // if(roles.indexOf('super manager') >= 0){
                //     accessedRouters = asyncRouterMap;
                // }

                commit('SET_ROUTERS', accessedRouters);
                resolve();
            })
        }
    }
}

export default permission