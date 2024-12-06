from datetime import datetime

from shared.schemas.base import Base


class SGetEvent(Base):
    id:            int
    name:          str
    description:   str | None = None
    price:         int
    date:          datetime
    location:      str
    is_registered: bool | None = None
    