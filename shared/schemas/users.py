from datetime import datetime

from shared.schemas.base import Base


class STokenPayload(Base):
    id:            int
    email:         str
    name:          str
    lastname:      str
    is_admin:      bool
    exp:           datetime
