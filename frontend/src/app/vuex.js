import {
    createLogger
} from "../dist/vue.mjs";

function setup(appinfo) {
    return {
        modules: {
            app: {
                state: {
                    info: appinfo,
                    // menu_items gives all the defined menu items
                    menu_items: {},
                    // The status of the websocket. null means disconnected, and a moment() object
                    // gives the time from which it was connected
                    websocket: null,
                },
                mutations: {
                    updateLoggedInUser(state, v) {
                        state.info.user = v;
                    },
                    addMenuItem(state, m) {
                        state.menu_items[m.key] = m;
                    },
                    setWebsocket(state, v) {
                        state.websocket = v;
                    },
                }
            }
        },
        plugins: [createLogger()]
    }
};


export default setup;