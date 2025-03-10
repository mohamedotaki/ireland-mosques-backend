const Mosques = require("../models/Mosques");
const prayerData = require("../models/PrayerData");
const pool = require("../config/db");
const time_table = require("../timeTable/timeTable.json");

//create routes
exports.appLunch = async (req, res, next) => {
  try {
    const SQLmosques = await Mosques.getAllMosques();
    const SQLprayers = await prayerData.getAllPrayers();
    const mosques = createMosqueObject(SQLmosques, SQLprayers);
    res.status(200).json({ mosques });
  } catch (error) {
    console.error(error);
  } finally {
  }
};

const createMosqueObject = (mosques, prayers) => {
  const mosquesObject = {};
  mosques.forEach((mosque) => {
    const mosqueID = mosque.id;
    // Check if the order is already in the orders object
    if (!mosquesObject[mosqueID]) {
      // If not, create a new order with empty orderDetails array
      mosquesObject[mosqueID] = {
        id: mosqueID,
        name: mosque.name,
        address: mosque.note,
        eircode: mosque.eircode,
        location: mosque.location,
        contact_number: mosque.contact_number,
        website: mosque.website,
        latitude: mosque.latitude,
        longitude: mosque.longitude,
        iban: mosque.iban,
        prayers: [],
      };
    }
    prayers.forEach((row) => {
      mosquesObject[mosqueID].prayers.push({
        id: row.id,
        prayer_name: row.prayer_name,
        adhan_time: row.adhan_time,
        adhan_locked: row.adhan_locked,
        iquamh_time: row.iquamh_time,
        iquamh_offset: row.iquamh_offset,
      });
    });
    // Add the order detail to the order's details array
  });

  // Convert the orders object to an array
  return Object.values(mosquesObject);
};
