const pool = require("../config/db");

//routes table
const createMosque = async (mosque, connection = pool) => {
  try {
    const [result] = await connection.execute(
      `INSERT INTO mosques 
      (name, address, eircode, location, contact_number, website, iban) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        mosque.name,
        mosque.address || null,
        mosque.eircode || null,
        mosque.location,
        mosque.contact_number,
        mosque.website || null,
        mosque.iban || null,
      ]
    );
    return result.insertId;
  } catch (error) {
    console.error("Error creating mosque:", error);
    throw new Error("Failed to create mosque.");
  }
};

const getAllMosquesWithPrayers = async () => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM mosques left join prayer_data ON prayer_data.mosque_id = mosques.id"
    );
    return rows;
  } catch (error) {
    console.error("Error retrieving mosques:", error);
    throw new Error("Failed to retrieve mosques.");
  }
};

const getAllUpdatedMosques = async (userLastUpdate) => {
  try {
    console.log(userLastUpdate);
    const [rows] = await pool.execute(
      "SELECT * FROM mosques left JOIN prayer_data ON prayer_data.mosque_id = mosques.id WHERE last_update >= ?",
      [userLastUpdate]
    );
    return rows;
  } catch (error) {
    console.error("Error retrieving mosques:", error);
    throw new Error("Failed to retrieve mosques.");
  }
};

const getMosqueByID = async (mosque_id) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM mosques WHERE id = ?", [
      mosque_id,
    ]);
    return rows[0] || null;
  } catch (error) {
    console.error("Error retrieving mosque by ID:", error);
    throw new Error("Failed to retrieve mosque by ID.");
  }
};

const getMosqueByName = async (mosque_name) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM mosques WHERE name = ?", [
      mosque_name,
    ]);
    return rows[0] || null;
  } catch (error) {
    console.error("Error retrieving mosque by name:", error);
    throw new Error("Failed to retrieve mosque by name.");
  }
};

const updateMosque = async (mosque_id, fieldsToUpdate, connection = pool) => {
  const allowedFields = [
    "name",
    "address",
    "eircode",
    "location",
    "contact_number",
    "website",
    "iban",
  ];

  // Filter out invalid fields
  const invalidFields = Object.keys(fieldsToUpdate).filter(
    (field) => !allowedFields.includes(field)
  );
  if (invalidFields.length > 0) {
    throw new Error(`Invalid fields provided: ${invalidFields.join(", ")}.`);
  }

  if (Object.keys(fieldsToUpdate).length === 0) {
    throw new Error("No fields to update provided.");
  }

  // Generate the SET clause dynamically
  const setClause = Object.keys(fieldsToUpdate)
    .map((field) => `${field} = ?`)
    .join(", ");
  const values = [...Object.values(fieldsToUpdate), mosque_id];

  try {
    const [result] = await connection.execute(
      `UPDATE mosques SET ${setClause} WHERE id = ?`,
      values
    );
    return result.affectedRows;
  } catch (error) {
    console.error("Error updating mosque:", error);
    throw new Error("Failed to update mosque.");
  }
};

const updateModifiedDate = async (mosque_id) => {
  try {
    const [result] = await connection.execute(
      `UPDATE mosques SET last_update WHERE id = ?`,
      [mosque_id]
    );
    return result.affectedRows;
  } catch (error) {
    console.error("Error updating mosque:", error);
    throw new Error("Failed to update mosque.");
  }
};

const deleteMosque = async (mosque_id) => {
  try {
    const [result] = await pool.execute("DELETE FROM mosques WHERE id = ?", [
      mosque_id,
    ]);
    return result.affectedRows;
  } catch (error) {
    console.error("Error deleting mosque:", error);
    throw new Error("Failed to delete mosque.");
  }
};

module.exports = {
  createMosque,
  deleteMosque,
  updateMosque,
  getMosqueByName,
  getMosqueByID,
  getAllMosquesWithPrayers,
  getAllUpdatedMosques,
};
