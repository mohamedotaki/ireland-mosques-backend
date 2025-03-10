const Mosques = require("../models/Mosques");
const prayerData = require("../models/PrayerData");
const pool = require("../config/db");

//create routes
exports.createMosque = async (req, res, next) => {
  const { mosque } = req.body;
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  try {
    const mosque_id = await Mosques.createMosque(mosque, connection);
    const prayerData_id = await prayerData.createPrayerData(
      mosque_id,
      connection
    );
    await connection.commit();
    res.status(201).json({ message: "Mosque was added" });
  } catch (error) {
    console.error(error);
    await connection.rollback();
  } finally {
    connection.release();
  }
};

//create routes
exports.hello = async (req, res, next) => {
  const prams = req.params;
  console.log(prams);
  res.status(201).json({ message: "Mosque was added" });
};
