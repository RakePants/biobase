from sqlalchemy import Table, Column, Integer, String, MetaData

metadata = MetaData()

names = Table(
    "names",
    metadata,
    Column("name", String, primary_key=True)
)
