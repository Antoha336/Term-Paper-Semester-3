from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, scoped_session

from env import get_env_var


Base = declarative_base()

credits = {
    'name': get_env_var('DATABASE_NAME'),
    'user': get_env_var('DATABASE_USER'),
    'password': get_env_var('DATABASE_PASSWORD'),
}

engine = create_engine(f'postgresql+psycopg2://{credits["user"]}:{credits["password"]}@database:5432/{credits["name"]}')
Base.metadata.create_all(engine)

db = scoped_session(sessionmaker(bind=engine))
