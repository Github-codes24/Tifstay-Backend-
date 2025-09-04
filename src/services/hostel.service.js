const Hostel = require("../models/hostel.model");

class HostelService {
  static async createHostel(data) {
    const hostel = new Hostel(data);
    return await hostel.save();
  }

  static async getHostelById(id) {
    return await Hostel.findById(id).populate("user", "name email");
  }

  static async getAllHostels() {
    return await Hostel.find().populate("user", "name email");
  }
}

module.exports = HostelService;
