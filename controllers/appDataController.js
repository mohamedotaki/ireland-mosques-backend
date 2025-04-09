const Mosques = require("../models/Mosques");
const prayerData = require("../models/PrayerData");
const pool = require("../config/db");
const time_table = require("../timeTable/timeTable.json");

//create routes
exports.appLunch = async (req, res, next) => {
  try {
    const newUpdateDate = new Date();
    const SQLmosques = await Mosques.getAllMosquesWithPrayers();
    const mosques = createMosqueObject(SQLmosques);
    res.status(200).json({ mosques, newUpdateDate });
  } catch (error) {
    console.error(error);
  } finally {
  }
};

//create routes
exports.checkForNewData = async (req, res, next) => {
  try {
    const { userLastUpdate } = req.query;
    const newUpdateDate = new Date();
    const SQLmosques = await Mosques.getAllUpdatedMosques(userLastUpdate);
    if (SQLmosques.length > 0) {
      const mosques = createMosqueObject(SQLmosques);
      res.status(200).json({ mosques, newUpdateDate });
    } else {
      res.status(200).json({ mosques: [], newUpdateDate });
    }
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
        time_table: time_table[mosque.location] || null,
        prayers: [],
      };
    }

    mosquesObject[mosqueID].prayers.push({
      id: mosque.prayer_id,
      prayer_name: mosque.prayer_name,
      adhan_time: mosque.adhan_time,
      adhan_locked: mosque.adhan_locked,
      iquamh_time: mosque.iquamh_time,
      iquamh_offset: mosque.iquamh_offset,
    });

    // Add the order detail to the order's details array
  });

  return mosquesObject;
  // Convert the orders object to an array
  /*   return Object.values(mosquesObject);
   */
};
