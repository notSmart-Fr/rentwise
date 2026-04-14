import sys
import os

# Add the current directory to sys.path so we can import 'app'
sys.path.append(os.getcwd())

from sqlalchemy import text
from app.db.session import engine

def reset_database():
    tables = [
        "messages",
        "conversations",
        "rental_requests",
        "tickets",
        "properties",
        "users"
    ]
    
    print(f"Attempting to reset tables: {', '.join(tables)}")
    
    with engine.connect() as connection:
        transaction = connection.begin()
        try:
            # PostgreSQL specific TRUNCATE with CASCADE to handle foreign keys
            # and RESTART IDENTITY to reset IDs to 1
            table_str = ", ".join(tables)
            connection.execute(text(f"TRUNCATE TABLE {table_str} RESTART IDENTITY CASCADE"))
            transaction.commit()
            print("Successfully wiped all data. The DB is now clean.")
        except Exception as e:
            transaction.rollback()
            print(f"FAILED to reset database: {str(e)}")
            sys.exit(1)

if __name__ == "__main__":
    reset_database()
