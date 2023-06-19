from sqlalchemy import Table, Column, Integer, String, MetaData

metadata = MetaData()

names = Table(
    "baa",
    metadata,
    Column("name", String, primary_key=True)
)
