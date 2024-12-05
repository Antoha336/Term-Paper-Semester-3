from datetime import datetime

from shared.schemas.base import Base


class SGetEvent(Base):
    id:          int
    name:        str
    price:       int
    date:        datetime
    location:    str
    