const Mosques = require("../models/Mosques");
const prayerData = require("../models/PrayerData");
const pool = require("../config/db");

//create routes
exports.updatePrayerTime = async (req, res, next) => {
  try {
    const { mosqueID, prayerID, newPrayerTime, offset, isIqamah, user } =
      req.body;
    if (user.mosqueID !== mosqueID) {
      res
        .status(403)
        .json({ message: "You are not authorized to update this mosque" });
    }
    const now = getDateTimeString(new Date());
    if (isIqamah) {
      const updated = await prayerData.updateIquamh(
        newPrayerTime,
        "2025-01-01 17:30:00",
        offset,
        mosqueID,
        prayerID
      );
      if (updated) {
        return res.status(200).json({ message: "Iquamh time updated" });
      } else {
        return res.status(400).json({ message: "Failed to update Iquamh" });
      }
    } else {
      const [rows, fields] = await pool.query("SELECT NOW()");
      console.error("Current Time in UTC:", rows[0]["NOW()"]);
      console.error("Current Time:", now);
      const updated = await prayerData.updateAdhan(
        newPrayerTime,
        now,
        mosqueID,
        prayerID
      );
      if (updated) {
        return res.status(200).json({ message: "Adhan updated" });
      } else {
        return res.status(400).json({
          message: "You dont have permission to update this adhan time",
        });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Failed to update prayer time" });
  }
};

const getDateTimeString = (date) => {
  const pad = (num) => num.toString().padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // Months are 0-indexed, so add 1
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
