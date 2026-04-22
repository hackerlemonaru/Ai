import sqlite3
import random
import datetime

DB_PATH = 'state.db'

def get_tools():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('SELECT id, name, url, status FROM tools')
    tools = cursor.fetchall()
    conn.close()
    return tools

def ping_tool(url):
    """Simulate a ping to the tool's URL."""
    # In a real scenario, use requests.get(url, timeout=5)
    # and return 'up' if status_code == 200 else 'down'
    # Here, we randomly simulate downtime (10% chance)
    return 'down' if random.random() < 0.1 else 'up'

def check_offers(tool_name):
    """Simulate checking for offers on deal sites."""
    offers = []
    if random.random() < 0.3: # 30% chance to find an offer
        offers.append({
            "offer_type": "Discount Code",
            "discount_code": f"{tool_name.upper()}SAVE20",
            "description": "20% off all plans",
            "valid_until": (datetime.datetime.now() + datetime.timedelta(days=7)).strftime("%Y-%m-%d %H:%M:%S")
        })
    return offers

def update_tool_status(tool_id, status):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE tools SET status = ?, last_checked = CURRENT_TIMESTAMP WHERE id = ?
    ''', (status, tool_id))
    conn.commit()
    conn.close()

def insert_offers(tool_id, offers):
    if not offers:
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    for offer in offers:
        cursor.execute('''
            INSERT INTO offers (tool_id, offer_type, discount_code, description, valid_until)
            VALUES (?, ?, ?, ?, ?)
        ''', (tool_id, offer['offer_type'], offer['discount_code'], offer['description'], offer['valid_until']))
    conn.commit()
    conn.close()

def run_pinger():
    print("Starting pinger run...")
    tools = get_tools()

    for tool in tools:
        tool_id, name, url, current_status = tool
        print(f"Pinging {name} ({url})...")

        # Check uptime
        new_status = ping_tool(url)
        if new_status != current_status:
            print(f"  -> Status changed: {current_status} -> {new_status}")
        update_tool_status(tool_id, new_status)

        # Check offers
        print(f"Checking offers for {name}...")
        new_offers = check_offers(name)
        if new_offers:
            print(f"  -> Found {len(new_offers)} new offers!")
            insert_offers(tool_id, new_offers)

    print("Pinger run complete.")

if __name__ == "__main__":
    run_pinger()
