import Vue from "../dist/vue.mjs";
import vuexModule from "./main/vuex.js";
import Notification from "./main/notification.vue";
import NotificationsPage from "./main/notifications_page.vue";
import AppComponent from "./main/app_component.vue";
import ObjectComponent from "./main/object_component.vue";
import MenuIcon from "./main/menu_icon.vue";

function setup(app) {
    Vue.component("h-notification", Notification)

    if (app.info.user != null) {
        app.store.registerModule("notifications", vuexModule);

        app.app.addComponent({
            key: "notifications",
            weight: 0.1,
            component: AppComponent
        });
        app.object.addComponent({
            key: "notifications",
            weight: 0.1,
            component: ObjectComponent
        });

        app.addRoute({
            path: "/notifications",
            component: NotificationsPage
        });

        app.addMenuItem({
            key: "notifications",
            text: "Notifications",
            component: MenuIcon,
            route: "/notifications",
            location: "primary_bottom"
        });

        let notifier = (e) => {
            if (e.event.includes("delete")) {
                app.store.commit("deleteNotification", e.data);
            } else {
                app.store.commit("setNotification", e.data);
            }
        }

        let types = ["user", "app", "object"];
        let etypes = ["create", "update", "delete"]
        types.forEach((t) => etypes.forEach((et => {

            let etype = `${t}_notification_${et}`;
            app.websocket.subscribe(etype, {
                event: etype,
                user: app.info.user.username
            }, notifier);
        })));

        app.store.dispatch("readGlobalNotifications");
    }

}

export default setup;