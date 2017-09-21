
import { setToken,removeToken,getToken } from '../../utils/auth';
import { login,getInfo,logout } from '../../api/login';



const user = {
    state: {
        name: '',
        account: '',
        token: getToken(),
        roles: [],
        permissions: [],
        loaded:false
    },
    mutations: {
        SET_TOKEN: (state,token) => {
            state.token = token;
        },
        SET_NAME: (state,name) => {
            state.name = name;
        },
        SET_ACCOUNT: (state,account) => {
            state.account = account;
        },
        SET_ROLES: (state,roles) => {
            state.roles = roles;
        },
        SET_PERMISSIONS: (state,permissions) => {
            state.permissions = permissions;
        },
        SET_LOADED: (state,loaded) => {
            state.loaded = loaded;
        },

    },
    actions: {
        Login({ commit },userInfo){

            return new Promise((resolve,reject) => {

                login(userInfo).then(response =>{
                    //判断是否登录成功，还要
                    const data = response.data;
                    if(!data.code || data.code == 0){
                        console.log("setToken success");
                        setToken(data.token,data.expires);
                        commit('SET_TOKEN', data.token);
                    }
                    resolve(data);
                }).catch(error => {
                    console.log(error);
                    reject(error);
                })
            })
        },

        GetInfo({ commit,state }){
          return new Promise((resolve,reject) => {
              getInfo().then(response => {
                  const data =response.data;

                  commit('SET_NAME', data.name);
                  commit('SET_ACCOUNT', data.account);
                  commit('SET_ROLES', data.roles);
                  commit('SET_PERMISSIONS',data.permissions);
                  commit('SET_LOADED', true);
                  console.log("getInfo success");
                  resolve(response);
              }).catch(error => {
                  reject(error);
              });
          })
        },
        //认证失败登出
        FailLogOut({ commit }){
            return new Promise(resolve =>{
                console.log("认证失败登出!");
                commit('SET_TOKEN','');
                removeToken();
                resolve();
            })
        },
        LogOut({ commit, state}){
            return new Promise((resolve,reject) =>{
                logout().then(() => {
                    commit('SET_TOKEN', '');
                    commit('SET_ROLES', []);
                    removeToken();
                    resolve();
                }).catch( error => {
                    reject(error);
                })
            });
        },

    }
}

export default user