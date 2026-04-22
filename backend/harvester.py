import json
import sqlite3
import datetime
import os

DB_PATH = 'state.db'
CHECKPOINT_FILE = 'harvester_checkpoint.json'

DUMMY_TOOLS = [
    {
        "name": "SuperAI",
        "url": "https://superai.example.com",
        "pricing_tier": "Freemium",
        "best_for": "Solo Devs",
        "pros": "Fast, cheap, easy",
        "cons": "Lacks enterprise features",
        "cost_per_1m": "$150",
        "free_tier_limit": "10k req/mo",
        "status": "up"
    },
    {
        "name": "DataCrunch",
        "url": "https://datacrunch.example.com",
        "pricing_tier": "Paid",
        "best_for": "Enterprise",
        "pros": "Scalable, secure",
        "cons": "Expensive, steep learning curve",
        "cost_per_1m": "$500",
        "free_tier_limit": "No Free Tier",
        "status": "up"
    },
    {
        "name": "FreeBot",
        "url": "https://freebot.example.com",
        "pricing_tier": "Free",
        "best_for": "Hobbyists",
        "pros": "Completely free, open-source",
        "cons": "No support, buggy",
        "cost_per_1m": "$0",
        "free_tier_limit": "Unlimited",
        "status": "down"
    }
]

def load_checkpoint():
    if os.path.exists(CHECKPOINT_FILE):
        with open(CHECKPOINT_FILE, 'r') as f:
            return json.load(f)
    return {"last_index": 0}

def save_checkpoint(index):
    with open(CHECKPOINT_FILE, 'w') as f:
        json.dump({"last_index": index}, f)

def fetch_tool_data(index):
    """Simulates fetching tool data from web/APIs."""
    if index < len(DUMMY_TOOLS):
        return DUMMY_TOOLS[index]
    return None

def insert_tool(tool_data):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    try:
        cursor.execute('''
            INSERT INTO tools (name, url, pricing_tier, best_for, pros, cons, cost_per_1m, free_tier_limit, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            tool_data['name'],
            tool_data['url'],
            tool_data['pricing_tier'],
            tool_data['best_for'],
            tool_data['pros'],
            tool_data['cons'],
            tool_data['cost_per_1m'],
            tool_data['free_tier_limit'],
            tool_data['status']
        ))
        conn.commit()
    except sqlite3.IntegrityError:
        print(f"Tool {tool_data['name']} already exists. Skipping insertion.")
    finally:
        conn.close()

def run_harvest():
    print("Starting harvest...")
    checkpoint = load_checkpoint()
    start_index = checkpoint.get("last_index", 0)

    index = start_index
    while True:
        tool_data = fetch_tool_data(index)
        if not tool_data:
            print("Harvest complete. No more tools.")
            break

        print(f"Harvesting: {tool_data['name']}...")
        insert_tool(tool_data)

        index += 1
        save_checkpoint(index)

if __name__ == "__main__":
    run_harvest()
