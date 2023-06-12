import yadisk
import os
import datetime

def backup():
    dump_dir = os.getcwd() + '/dumps'
    filename = f"bio_{datetime.date.today().strftime('%d/%m/%Y')}.sql"
    
    # TODO: переделать на сервере
    os.system(f"pg_dump bio > {dump_dir}/{filename}")

    y = yadisk.YaDisk(token="y0_AgAAAAAhVuzMAAoJMQAAAADlT7VKxLj0F2jjQWmqSpZhUhX-oJaPg8U")

    if y.check_token():
        y.upload(f"{filename}", f"/backup/{filename}")
        print(f"Uploaded {filename}")
        
    else:
        print('Token is invalid')
