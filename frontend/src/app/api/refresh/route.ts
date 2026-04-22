import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';
import path from 'path';

const execPromise = util.promisify(exec);

export async function POST() {
  try {
    const backendPath = path.resolve(process.cwd(), '../backend');
    console.log("Triggering manual sync...");

    // In a real app, you would add an admin secret token check here

    // Run the pinger to update uptime and check for offers
    const { stdout, stderr } = await execPromise(`cd ${backendPath} && python pinger.py`);

    console.log("Sync output:", stdout);
    if (stderr) {
      console.error("Sync stderr:", stderr);
    }

    return NextResponse.json({ success: true, message: "Sync successful", output: stdout });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json({ success: false, error: "Sync failed" }, { status: 500 });
  }
}
