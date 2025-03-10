const Mosques = require("../models/Mosques");
const prayerData = require("../models/PrayerData");
const pool = require("../config/db");
const time_table = require("../timeTable/timeTable.json");

//create routes
exports.appLunch = async (req, res, next) => {
  try {
    Mosques.getAllMosques();
  } catch (error) {
    console.error(error);
  } finally {
  }
};
