import sys
from os.path import dirname as up

project_dir = up(up(up(__file__)))
sys.path.append(project_dir)

import yadisk
import os
import datetime
from backend.src.config import DB_HOST, DB_NAME, DB_PASS, DB_USER, DB_PORT, YA_TOKEN


def backup():
    
    dump_dir = os.getcwd() + '/dumps/'
    filename = f"{DB_NAME}{datetime.date.today().strftime('%d:%m:%Y')}.dump"
    print(dump_dir)
    
    os.system(f"sudo -i -u postgres pg_dump {DB_NAME} > {dump_dir}/{filename}")

    y = yadisk.YaDisk(token=YA_TOKEN)

    if y.check_token():
        y.upload(f"{dump_dir}/{filename}", f"/backup/{filename}")
        print(f"Uploaded {filename}")

    else:
        print('Token is invalid, no backup created')