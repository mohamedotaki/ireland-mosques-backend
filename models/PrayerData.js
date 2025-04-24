const pool = require("../config/db");

//routes table
const createPrayerData = async (mosque_id, now, connection = pool) => {
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
    now,
    now,
  ]);

  const [inserted_prayers] = await connection.query(
    "INSERT INTO prayer_data (mosque_id,prayer_name,adhan_locked,iquamh_modified_on,adhan_modified_on) VALUES ?",
    [prayer_to_insert]
  );
  return inserted_prayers.affectedRows;
};

const updateIquamh = async (
  iquamh_time,
  updated_at,
  iquamh_offset,
  mosque_id,
  id,
  userID
) => {
  if (iquamh_time && iquamh_offset) {
    throw Error("You can set only fixed time or offset time");
  } else {
    const [rows] = await pool.execute(
      `UPDATE prayer_data SET iquamh_time =? , iquamh_offset =?,iquamh_modified_on =?,modified_by=?  WHERE mosque_id = ? AND prayer_id = ?`,
      [
        iquamh_time || null,
        iquamh_offset || null,
        updated_at,
        userID,
        mosque_id,
        id,
      ]
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

//update adhan times
const updateAdhan = async (time, updated_at, mosque_id, id, userID, offset) => {
  if (time && offset) {
    throw Error("You can set only fixed time or offset time");
  } else {
    const [rows] = await pool.execute(
      `UPDATE prayer_data SET adhan_time =? ,adhan_offset=?, adhan_modified_on=?,modified_by=? WHERE mosque_id = ? AND prayer_id = ? AND (adhan_locked IS NULL OR adhan_locked = FALSE)`,
      [time, offset, updated_at, userID, mosque_id, id]
    );
    return rows.affectedRows;
  }
};

module.exports = {
  createPrayerData,
  updateIquamh,
  updateAdhan,
  getAllPrayers,
};
