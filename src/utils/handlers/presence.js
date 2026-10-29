import { sanitizeText } from '../sanitizer.js';
import * as mysql from 'mysql';
import { ActivityType } from 'discord.js';


function handlePresenceUpdate(oldPresence, newPresence) {
    // This function listens to presence updates in a Discord guild and tracks user activities.
    const activities = newPresence?.activities || [];
    

    // If there are no activities associated with the presence, return early.
    if (activities.length === 0) return;

    // Loop through each activity performed by the user.
    activities.forEach(activity => {
        // Filter for "Playing" or "Listening" type activities only.
        let query, values;

        const user = newPresence.member?.user;
        if (!user || user.bot) return; // Skip if the member is not a bot.

        // Get the activity details and name/status.
        const details = activity.details || '';
        // Prioritize name for music bots. This line retrieves the actual text state of the user's activity (e.g., "listening to a song" or "working"), falling
        const status = activity.state || activity.name || 'Playing'; 
        if (!details && !status) return; // Avoid inserting empty records.
        // Deduplication: Avoid creating multiple records in a short timeframe per user.
        const safeTimestamp = new Date();

        // Use an SQL query to insert user activity into the database.
        if (activity.type === ActivityType.Playing) {
            console.log(`${user.username} is doing ${activity.name}`);
            query = `INSERT INTO games (username, name, status, timestamp) VALUES (?, ?, ?)`;
            values = [user.username, sanitizeText(status), safeTimestamp];
            console.log(`Activity type: Playing: ${user.username}, ${status}, ${safeTimestamp}`)
            db.query(query, values, (err, results) => {
                if (err) console.error("Failed to run query into database: ", err);
                else console.log(`Logged: ${user.username} - ${activity.name || status}`);
            });
        } else if (activity.type === ActivityType.Listening) {
            query = `INSERT INTO malmveienbot (username, song, artist, timestamp) VALUES (?, ?, ?, ?)`;
            values = [user.username, sanitizeText(details), sanitizeText(status), safeTimestamp];
            console.log(`Activity type: Listening: ${user.username}, ${details}, ${status}, ${safeTimestamp}`)
            db.query(query, values, (err, results) => {
                if (err) console.error("Failed to run query into database: ", err);
                else console.log(`Logged: ${user.username} - ${activity.name || status}`);
            });
        }
    });
}

export default handlePresenceUpdate;  // ✅ Default export (ES Module standard)
