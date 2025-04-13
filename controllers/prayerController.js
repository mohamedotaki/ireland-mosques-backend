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
    if (isIqamah) {
      const updated = await prayerData.updateIquamh(
        newPrayerTime,
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
      const updated = await prayerData.updateAdhan(
        newPrayerTime,
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
