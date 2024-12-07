from datetime import datetime

from shared.schemas.base import Base


class SEventQueryParams(Base):
    is_available:  bool | None = None


class SGetEvent(Base):
    id:            int
    is_available:  bool
    name:          str
    description:   str      | None = None
    date:          datetime
    location:      str
    is_registered: bool     | None = None


class SCreateEvent(Base):
    is_available:  bool
    name:          str
    description:   str
    date:          datetime
    location:      str


class SUpdateEvent(Base):
    is_available:  bool     | None = None
    name:          str      | None = None
    description:   str      | None = None
    date:          datetime | None = None
    location:      str      | None = None
