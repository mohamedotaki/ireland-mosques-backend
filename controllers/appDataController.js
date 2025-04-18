const Mosques = require("../models/Mosques");
const User = require("../models/Users");
const time_table = require("../timeTable/timeTable.json");
const jwt = require("jsonwebtoken");
const jwtSecretKey = process.env.key || "TestingKey";
const moment = require("moment-timezone");

//create routes
exports.appLunch = async (req, res, next) => {
  try {
    const now = moment().utc().format("YYYY-MM-DD HH:mm:ss");
    const SQLmosques = await Mosques.getAllMosquesWithPrayers();
    const mosques = createMosqueObject(SQLmosques);
    res.status(200).json({ mosques, newUpdateDate: now });
  } catch (error) {
    console.error(error);
  } finally {
  }
};

//create routes
exports.checkForNewData = async (req, res, next) => {
  try {
    const token = req.cookies.Authorization;
    const { userLastUpdate } = req.query;
    const now = moment().utc().format("YYYY-MM-DD HH:mm:ss");
    let user = null;
    if (token) {
      try {
        const verified = jwt.verify(token, jwtSecretKey);
        if (verified) {
          const dbUser = await User.getModifiedUser(
            verified.userID,
            userLastUpdate
          );
          if (dbUser) {
            user = {
              name: dbUser.name,
              userType: dbUser.user_type,
              account_status: dbUser.account_status,
              createdAt: dbUser.created_at,
              lastSignin: dbUser.last_signin,
              modified_on: dbUser.modified_on,
              mosqueID: dbUser.mosqueID,
            };
            const token = createToken(dbUser);
            res.cookie("Authorization", token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "Strict",
              maxAge: 365 * 24 * 60 * 60 * 1000,
            });
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
    const SQLmosques = await Mosques.getAllUpdatedMosques(userLastUpdate);
    if (SQLmosques.length > 0) {
      const mosques = createMosqueObject(SQLmosques);
      res.status(200).json({ mosques, newUpdateDate: now, user });
    } else {
      res.status(200).json({ mosques: [], newUpdateDate: now, user });
    }
  } catch (error) {
    console.error(error);
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
      adhan_modified_on: moment(mosque.adhan_modified_on).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
      iquamh_modified_on: moment(mosque.iquamh_modified_on).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
    });

    // Add the order detail to the order's details array
  });

  return mosquesObject;
  // Convert the orders object to an array
  /*   return Object.values(mosquesObject);
   */
};

const createToken = (user) => {
  return jwt.sign(
    {
      userID: user.id,
      name: user.name,
      userType: user.user_type,
      account_status: user.account_status,
      email: user.email,
      createdAt: user.created_at,
      lastSignin: user.last_signin,
      modified_on: user.modified_on,
      mosqueID: user.mosqueID,
    },
    jwtSecretKey,
    { expiresIn: "365d" }
  );
};
