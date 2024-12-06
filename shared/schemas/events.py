from datetime import datetime

from shared.schemas.base import Base


class SGetEvent(Base):
    id:            int
    is_available:  bool
    name:          str
    description:   str | None = None
    date:          datetime
    location:      str
    is_registered: bool | None = None
    