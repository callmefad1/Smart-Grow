
import { database } from "../config/firebaseConfig";
import { ref, update } from "firebase/database";


export async function saveAutoSettings(formData = {}, db = database) {
    const updates = {};

    Object.keys(formData).forEach((key) => {
        const raw = formData[key];
        if (raw !== '' && raw !== undefined && raw !== null) {
            const parsed = parseFloat(raw);
            if (!Number.isNaN(parsed)) {
                updates[`iot/data/autoSettings/${key}`] = parsed;
            }
        }
    });

    // If there is nothing to update, just return early
    if (Object.keys(updates).length === 0) {
        return { updated: false };
    }

    await update(ref(db), updates);
    return { updated: true, keys: Object.keys(updates) };
}

export default { saveAutoSettings };
