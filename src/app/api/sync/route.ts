import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { getDbConnection } from '@/lib/db';

// Simulate pinging a tool
function pingTool() {
    return Math.random() < 0.1 ? 'down' : 'up';
}

// Simulate checking offers
function checkOffers(toolName: string) {
    const offers = [];
    if (Math.random() < 0.3) {
        const validUntil = new Date();
        validUntil.setDate(validUntil.getDate() + 7);
        offers.push({
            offer_type: "Discount Code",
            discount_code: `${toolName.toUpperCase()}SAVE20`,
            description: "20% off all plans",
            valid_until: validUntil.toISOString().split('T')[0] + ' 23:59:59'
        });
    }
    return offers;
}

export async function POST() {
    console.log("Starting Next.js API sync (replacing pinger.py & harvester.py)...");

    // In a real scenario, check an admin secret here!

    try {
        return new Promise<NextResponse>((resolve) => {
            const db = getDbConnection();

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            db.all("SELECT id, name, url, status FROM tools", (err, tools: any[]) => {
                if (err) {
                    console.error("Error fetching tools for sync:", err);
                    db.close();
                    return resolve(NextResponse.json({ success: false, error: "Sync failed" }, { status: 500 }));
                }

                let processed = 0;
                let changes = 0;

                if (tools.length === 0) {
                    db.close();
                    return resolve(NextResponse.json({ success: true, message: "No tools to sync." }));
                }

                tools.forEach((tool) => {
                    const newStatus = pingTool();
                    if (newStatus !== tool.status) {
                        changes++;
                    }

                    db.run(`UPDATE tools SET status = ?, last_checked = CURRENT_TIMESTAMP WHERE id = ?`, [newStatus, tool.id], (updateErr) => {
                        if (updateErr) console.error("Error updating status:", updateErr);

                        const newOffers = checkOffers(tool.name);

                        if (newOffers.length > 0) {
                            changes++;
                            const stmt = db.prepare(`INSERT INTO offers (tool_id, offer_type, discount_code, description, valid_until) VALUES (?, ?, ?, ?, ?)`);
                            newOffers.forEach(offer => {
                                stmt.run([tool.id, offer.offer_type, offer.discount_code, offer.description, offer.valid_until]);
                            });
                            stmt.finalize();
                        }

                        processed++;
                        if (processed === tools.length) {
                            db.close();
                            resolve(NextResponse.json({
                                success: true,
                                message: `Sync complete. Analyzed ${tools.length} tools, made ${changes} updates.`
                            }));
                        }
                    });
                });
            });
        });
    } catch (error) {
        console.error("Sync error:", error);
        return NextResponse.json({ success: false, error: "Sync failed" }, { status: 500 });
    }
}
