import sys
from os.path import dirname as up

project_dir = up(up(up(__file__)))
sys.path.append(project_dir)

import yadisk
import os
import datetime
from backend.src.config import YA_TOKEN

def backup():
    dump_dir = os.getcwd() + '/dumps'
    filename = f"bio_{datetime.date.today().strftime('%d/%m/%Y')}.sql"
    
    # TODO: переделать на сервере
    os.system(f"pg_dump bio > {dump_dir}/{filename}")

    y = yadisk.YaDisk(token="YA_TOKEN")

    if y.check_token():
        y.upload(f"{filename}", f"/backup/{filename}")
        print(f"Uploaded {filename}")
        
    else:
        print('Token is invalid')
