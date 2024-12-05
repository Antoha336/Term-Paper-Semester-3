from datetime import datetime

from shared.schemas.base import Base
from shared.database.database import EventStatusEnum


class SGetEvent(Base):
    id:          int
    name:        str
    description: str | None = None
    location:    str
    status:      EventStatusEnum
    date:        datetime
