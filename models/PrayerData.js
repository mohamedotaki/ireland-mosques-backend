const pool = require("../config/db");

//routes table
const createPrayerData = async (mosque_id, connection = pool) => {
  const prayers = [
    { name: "Fajr", locked: true },
    { name: "Shurooq", locked: true },
    { name: "Dhuhr", locked: true },
    { name: "Asr", locked: true },
    { name: "Maghrib", locked: true },
    { name: "Isha", locked: false },
    { name: "Jummuah", locked: false },
  ];
  const prayer_to_insert = prayers.map(({ name, locked }) => [
    mosque_id,
    name,
    locked ? 1 : 0,
  ]);

  const [inserted_prayers] = await connection.query(
    "INSERT INTO prayer_data (mosque_id,prayer_name,adhan_locked) VALUES ?",
    [prayer_to_insert]
  );
  return inserted_prayers.affectedRows;
};

const updateIquamh = async (
  iquamh_time,
  updated_at,
  iquamh_offset,
  mosque_id,
  id
) => {
  if (iquamh_time && iquamh_offset) {
    throw Error("You can set only fixed time or offset time");
  } else {
    const [rows] = await pool.execute(
      `UPDATE prayer_data SET iquamh_time =? , iquamh_offset =?,iquamh_modified_on =?  WHERE mosque_id = ? AND prayer_id = ?`,
      [iquamh_time || null, iquamh_offset || null, updated_at, mosque_id, id]
    );
    return rows.affectedRows;
  }
};

const getAllPrayers = async () => {
  try {
    const [rows] = await pool.execute("SELECT * FROM prayer_data");
    return rows;
  } catch (error) {
    console.error("Error retrieving prayers:", error);
    throw new Error("Failed to retrieve prayers.");
  }
};

const getAllPrayersByMosqueID = async (mosque_ids) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM prayer_data where mosque_id = (?)",
      [mosque_ids]
    );
    return rows;
  } catch (error) {
    console.error("Error retrieving prayers:", error);
    throw new Error("Failed to retrieve prayers.");
  }
};

const updateAdhan = async (time, updated_at, mosque_id, id) => {
  const [rows] = await pool.execute(
    `UPDATE prayer_data SET adhan_time =? , adhan_modified_on=? WHERE mosque_id = ? AND prayer_id = ? AND (adhan_locked IS NULL OR adhan_locked = FALSE)`,
    [time, updated_at, mosque_id, id]
  );
  return rows.affectedRows;
};

module.exports = {
  createPrayerData,
  updateIquamh,
  updateAdhan,
  getAllPrayers,
};
