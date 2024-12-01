from os import environ
from dotenv import load_dotenv


load_dotenv()

def get_env_var(variable: str):
    value = environ.get(variable)
    if value is None:
        raise Exception(f'No enviroment variable: {variable}')
    
    return value
