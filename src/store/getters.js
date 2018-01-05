
const getters = {
    sidebar: state => state.app.sidebar,
    token: state => state.user.token,
    name: state => state.user.name,
    account: state => state.user.account,
    permissions: state => state.user.permissions,
    roles: state => state.user.roles,
    loaded: state => state.user.loaded,
    permission_routers: state => state.permission.routers,
    addRouters: state => state.permission.addRouters
}

export default getters
