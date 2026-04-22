import sqlite3
import os

DB_PATH = 'state.db'

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Tools table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tools (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            url TEXT NOT NULL,
            pricing_tier TEXT,
            best_for TEXT,
            pros TEXT,
            cons TEXT,
            cost_per_1m TEXT,
            free_tier_limit TEXT,
            last_checked DATETIME DEFAULT CURRENT_TIMESTAMP,
            status TEXT DEFAULT 'unknown'
        )
    ''')

    # Offers table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS offers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tool_id INTEGER,
            offer_type TEXT,
            discount_code TEXT,
            description TEXT,
            valid_until DATETIME,
            FOREIGN KEY(tool_id) REFERENCES tools(id)
        )
    ''')

    conn.commit()
    conn.close()
    print(f"Database initialized at {DB_PATH}")

if __name__ == "__main__":
    init_db()
