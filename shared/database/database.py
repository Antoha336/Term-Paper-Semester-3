import enum
import bcrypt

from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, Enum, ForeignKey
from sqlalchemy.orm import DeclarativeBase, sessionmaker, scoped_session, relationship

from shared.utils.env import get_env_var


class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = 'users'
    id            = Column(Integer, primary_key=True, autoincrement=True, unique=True)
    name          = Column(String, nullable=False)
    last_name     = Column(String, nullable=False)
    email         = Column(String, nullable=False)
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
    price         = Column(Integer, nullable=False)
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
