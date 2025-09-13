const Hostel = require("../models/hostel.model");

class HostelService {
  static async createHostel(data) {
    const hostel = new Hostel(data);
    return await hostel.save();
  }

  static async getHostelById(id) {
    return await Hostel.findById(id).populate("userId", "name email");
  }

  static async getAllHostels() {
    return await Hostel.find().populate("userId", "name email");
  }

  static async updateHostel(id, userId, data) {
  return await Hostel.findOneAndUpdate(
    { _id: id, userId },        // ensure only owner can update
    { $set: data },
    { new: true }
  );
}

}

module.exports = HostelService;
