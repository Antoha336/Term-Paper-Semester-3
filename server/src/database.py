from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, scoped_session

from env import get_env_var


Base = declarative_base()

ENGINE = get_env_var('DATABASE_ENGINE')
NAME = get_env_var('DATABASE_NAME')
USER = get_env_var('DATABASE_USER')
PASSWORD = get_env_var('DATABASE_PASSWORD')
HOST = get_env_var('DATABASE_HOST')
PORT = get_env_var('DATABASE_PORT')

engine = create_engine(f'{ENGINE}://{USER}:{PASSWORD}@{HOST}:{PORT}/{NAME}')
Base.metadata.create_all(engine)

db = scoped_session(sessionmaker(bind=engine))
