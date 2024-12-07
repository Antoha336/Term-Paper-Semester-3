import enum
import bcrypt

from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, ForeignKey, select
from sqlalchemy.orm import DeclarativeBase, sessionmaker, scoped_session, relationship

from shared.utils.env import get_env_var


class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = 'users'
    id            = Column(Integer, primary_key=True, autoincrement=True, unique=True)
    email         = Column(String, nullable=False, unique=True)
    name          = Column(String, nullable=False)
    lastname      = Column(String, nullable=False)
    password      = Column(String, nullable=False)
    is_admin      = Column(Boolean, nullable=False, default=False)

    events        = relationship('Event', secondary='event_users', back_populates='users')

    def set_password(self, password: str):
        self.password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def verify_password(self, password: str) -> bool:
        return bcrypt.checkpw(password.encode('utf-8'), self.password.encode('utf-8'))


class Event(Base):
    __tablename__ = 'events'
    id            = Column(Integer, primary_key=True, autoincrement=True, unique=True)
    is_available  = Column(Boolean, nullable=False, default=True)
    name          = Column(String, nullable=False)
    description   = Column(String, nullable=True)
    date          = Column(DateTime, nullable=False)
    location      = Column(String, nullable=False)

    users         = relationship('User', secondary='event_users', back_populates='events')


class EventUser(Base):
    __tablename__ = 'event_users'
    event_id      = Column(Integer, ForeignKey('events.id'), primary_key=True)
    user_id       = Column(Integer, ForeignKey('users.id'), primary_key=True)


ENGINE   = get_env_var('DATABASE_ENGINE')
NAME     = get_env_var('DATABASE_NAME')
USER     = get_env_var('DATABASE_USER')
PASSWORD = get_env_var('DATABASE_PASSWORD')
HOST     = get_env_var('DATABASE_HOST')
PORT     = get_env_var('DATABASE_PORT')

engine = create_engine(f'{ENGINE}://{USER}:{PASSWORD}@{HOST}:{PORT}/{NAME}')
Base.metadata.create_all(engine)
session = scoped_session(sessionmaker(bind=engine))


query = select(User).where(User.is_admin == True)
admin_user_exists = session.execute(query).scalar_one_or_none() is not None
if not admin_user_exists:
    ADMIN_EMAIL = get_env_var('ADMIN_EMAIL')
    ADMIN_PASSWORD = get_env_var('ADMIN_PASSWORD')

    admin_user = User(
        email=ADMIN_EMAIL,
        name='Антон',
        lastname='Маркаданов',
        is_admin=True,
    )
    admin_user.set_password(ADMIN_PASSWORD)
    session.add(admin_user)
    session.commit()
