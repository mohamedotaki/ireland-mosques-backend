const pool = require("../../config/db");
const {
  createMosque,
  getAllMosques,
  getMosqueByID,
  getMosqueByName,
  updateMosque,
  deleteMosque,
} = require("../Mosques");

jest.mock("../../config/db"); // Mock the database connection

describe("Mosque Service Tests", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock data after each test
  });

  describe("createMosque", () => {
    it("should create a mosque and return its ID", async () => {
      const mockMosque = {
        name: "Test Mosque",
        address: "123 Test St",
        eircode: "T12345",
        location: "Ballyhaunis",
        contact_number: "1234567890",
        website: "http://testmosque.com",
        iban: "DE89370400440532013000",
      };

      // Mock the database response
      const mockResult = [{ insertId: 1 }];
      pool.execute.mockResolvedValue(mockResult);

      const insertId = await createMosque(mockMosque);
      expect(insertId).toBe(1);
      expect(pool.execute).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO mosques"),
        expect.any(Array)
      );
    });

    it("should throw an error if database query fails", async () => {
      const mockMosque = {
        name: "Test Mosque",
        location: "City Center",
        contact_number: "1234567890",
      };

      pool.execute.mockRejectedValue(new Error("Database Error"));

      await expect(createMosque(mockMosque)).rejects.toThrow(
        "Failed to create mosque."
      );
    });
  });

  describe("getAllMosques", () => {
    it("should return a list of mosques", async () => {
      const mockRows = [
        { id: 1, name: "Mosque 1" },
        { id: 2, name: "Mosque 2" },
      ];
      pool.execute.mockResolvedValue([mockRows]);

      const mosques = await getAllMosques();
      expect(mosques).toEqual(mockRows);
      expect(pool.execute).toHaveBeenCalledWith("SELECT * FROM mosques");
    });

    it("should throw an error if database query fails", async () => {
      pool.execute.mockRejectedValue(new Error("Database Error"));

      await expect(getAllMosques()).rejects.toThrow(
        "Failed to retrieve mosques."
      );
    });
  });

  describe("getMosqueByID", () => {
    it("should return a mosque by ID", async () => {
      const mockMosque = { id: 1, name: "Test Mosque" };
      pool.execute.mockResolvedValue([[mockMosque]]);

      const mosque = await getMosqueByID(1);
      expect(mosque).toEqual(mockMosque);
      expect(pool.execute).toHaveBeenCalledWith(
        "SELECT * FROM mosques WHERE id = ?",
        [1]
      );
    });

    it("should return null if no mosque is found", async () => {
      pool.execute.mockResolvedValue([[]]);

      const mosque = await getMosqueByID(999);
      expect(mosque).toBeNull();
    });
  });

  describe("getMosqueByName", () => {
    it("should return a mosque by name", async () => {
      const mockMosque = { id: 1, name: "Test Mosque" };
      pool.execute.mockResolvedValue([[mockMosque]]);

      const mosque = await getMosqueByName("Test Mosque");
      expect(mosque).toEqual(mockMosque);
      expect(pool.execute).toHaveBeenCalledWith(
        "SELECT * FROM mosques WHERE name = ?",
        ["Test Mosque"]
      );
    });

    it("should return null if no mosque is found", async () => {
      pool.execute.mockResolvedValue([[]]);

      const mosque = await getMosqueByName("Nonexistent Mosque");
      expect(mosque).toBeNull();
    });
  });

  describe("updateMosque", () => {
    it("should update a mosque and return affected rows", async () => {
      const mockFields = { name: "Updated Mosque", address: "New Address" };
      const mockResult = [{ affectedRows: 1 }];
      pool.execute.mockResolvedValue(mockResult);

      const affectedRows = await updateMosque(1, mockFields);
      expect(affectedRows).toBe(1);
      expect(pool.execute).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE mosques SET"),
        expect.arrayContaining(["Updated Mosque", "New Address", 1])
      );
    });

    it("should throw an error if invalid fields are provided", async () => {
      const mockFields = { invalidField: "Invalid" };

      await expect(updateMosque(1, mockFields)).rejects.toThrow(
        "Invalid fields provided: invalidField."
      );
    });

    it("should throw an error if no fields are provided", async () => {
      await expect(updateMosque(1, {})).rejects.toThrow(
        "No fields to update provided."
      );
    });
  });

  describe("deleteMosque", () => {
    it("should delete a mosque and return affected rows", async () => {
      const mockResult = [{ affectedRows: 1 }];
      pool.execute.mockResolvedValue(mockResult);

      const affectedRows = await deleteMosque(1);
      expect(affectedRows).toBe(1);
      expect(pool.execute).toHaveBeenCalledWith(
        "DELETE FROM mosques WHERE id = ?",
        [1]
      );
    });

    it("should throw an error if database query fails", async () => {
      pool.execute.mockRejectedValue(new Error("Database Error"));

      await expect(deleteMosque(1)).rejects.toThrow("Failed to delete mosque.");
    });
  });
});
