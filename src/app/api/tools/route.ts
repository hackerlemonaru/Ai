import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { getDbConnection } from '@/lib/db';

export async function GET(): Promise<NextResponse> {
  try {
    return new Promise<NextResponse>((resolve) => {
      const db = getDbConnection(sqlite3.OPEN_READONLY);

      db.all("SELECT * FROM tools ORDER BY id ASC", (err, toolsRows) => {
        if (err) {
          console.error("Error querying tools:", err);
          resolve(NextResponse.json({ success: false, error: "Failed to fetch tools" }, { status: 500 }));
          db.close();
          return;
        }

        db.all("SELECT * FROM offers", (err, offersRows) => {
          db.close();

          if (err) {
            console.error("Error querying offers:", err);
            resolve(NextResponse.json({ success: false, error: "Failed to fetch offers" }, { status: 500 }));
            return;
          }

          // Combine tools with their respective offers
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const tools = toolsRows.map((tool: any) => ({
            ...tool,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            offers: offersRows.filter((offer: any) => offer.tool_id === tool.id)
          }));

          resolve(NextResponse.json({ success: true, tools }));
        });
      });
    });
  } catch (error) {
    console.error("API tools error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
