from typing import Dict
from .base import APIObject, APIList, Session, getSessionType, DEFAULT_URL
from .kv import KV

from . import users
from . import objects
from .notifications import Notifications

from functools import partial


class App(APIObject):
    props = {"name", "description", "icon", "settings", "settings_schema"}

    def __init__(self, access_token: str, url: str = DEFAULT_URL, session="sync"):
        appid = "self"
        if isinstance(session, Session):
            # Treat the session as already initialized, meaning that the access token is actually
            # the app id
            appid = access_token
            super().__init__(f"api/heedy/v1/apps/{appid}", {"app": appid}, session)

        else:
            # Initialize the app object as a direct API
            s = getSessionType(session, "self")
            s.setAccessToken(access_token)
            super().__init__("api/heedy/v1/apps/self", {"app": appid}, s)
        # The objects belonging to the app
        self.objects = objects.Objects({"app": appid}, self.session)
        self._kv = KV(f"api/heedy/v1/kv/apps/{appid}", self.session)

    @property
    def kv(self):
        return self._kv

    @kv.setter
    def kv(self, v):
        return self._kv.set(**v)

    @property
    def owner(self):
        return self.session.f(
            self.read(), lambda x: users.User(x["owner"], self.session)
        )


class Apps(APIList):
    def __init__(self, constraints: Dict, session: Session):
        super().__init__("api/heedy/v1/apps", constraints, session)

    def __getitem__(self, item):
        return self._getitem(item, f=lambda x: App(x["id"], session=self.session))

    def __call__(self, **kwargs):
        return self._call(
            f=lambda x: [App(xx["id"], session=self.session) for xx in x], **kwargs
        )

    def create(self, name, otype="timeseries", **kwargs):
        return self._create(
            f=lambda x: App(x["id"], session=self.session),
            **{"name": name, "type": otype, **kwargs},
        )