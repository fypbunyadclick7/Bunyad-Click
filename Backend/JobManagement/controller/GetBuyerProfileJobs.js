const Jobs = require("../models/Jobs"); // Import Jobs model
const Bids = require("../models/Bids"); // Import Bids model
const BidAttachments = require("../models/BidAttachments"); // Import BidAttachments model
const { Op } = require("sequelize");

const GetBuyerProfileJobs = async (req, res) => {
  const { userId } = req.params; // Extract userId from params (assuming it's passed in the URL)

  try {
    // Fetch Completed Jobs where the user is assigned to the job and its status is 'Completed'
    const completedJobs = await Jobs.findAll({
      where: {
        UserId: userId,
        Status: "Completed",
      },
      include: [
        {
          model: Bids,
          as: "Bids",
          //   where: { UserId: userId }, // Filter bids by UserId
          include: [
            {
              model: BidAttachments,
              as: "Attachments",
              attributes: ["Id", "FileUrl"],
            },
          ],
          attributes: ["Id", "Price", "Duration", "CoverLetter", "Status"],
        },
      ],
      attributes: [
        "Id",
        "Title",
        "Description",
        "CategoryId",
        "SubCategoryId",
        "Status",
      ],
      order: [["CreatedAt", "DESC"]],
    });

    // Fetch Assigned Jobs where the user is assigned and its status is 'Assigned'
    const assignedJobs = await Jobs.findAll({
      where: {
        UserId: userId,
        Status: "Assigned",
      },
      include: [
        {
          model: Bids,
          as: "Bids",
          //   where: { UserId: userId },
          include: [
            {
              model: BidAttachments,
              as: "Attachments",
              attributes: ["Id", "FileUrl"],
            },
          ],
          attributes: ["Id", "Price", "Duration", "CoverLetter", "Status"],
        },
      ],
      attributes: [
        "Id",
        "Title",
        "Description",
        "CategoryId",
        "SubCategoryId",
        "Status",
      ],
      order: [["CreatedAt", "DESC"]],
    });

    const activeJobs = await Jobs.findAll({
      where: {
        UserId: userId,
        Status: "Active",
      },
      include: [
        {
          model: Bids,
          as: "Bids",
          //   where: { UserId: userId },
          include: [
            {
              model: BidAttachments,
              as: "Attachments",
              attributes: ["Id", "FileUrl"],
            },
          ],
          attributes: ["Id", "Price", "Duration", "CoverLetter", "Status"],
        },
      ],
      attributes: [
        "Id",
        "Title",
        "Description",
        "CategoryId",
        "SubCategoryId",
        "Status",
      ],
      order: [["CreatedAt", "DESC"]],
    });

    console.log("Completed Jobs:", completedJobs);
    console.log("Assigned Jobs:", assignedJobs);
    console.log("Active Jobs:", activeJobs);

    // Return the jobs and bids, including attachments, in the response
    return res.status(200).json({
      success: true,
      CompletedJobs: completedJobs.length > 0 ? completedJobs : [],
      AssignedJobs: assignedJobs.length > 0 ? assignedJobs : [],
      ActiveJobs: activeJobs.length > 0 ? activeJobs : [],
    });
  } catch (error) {
    console.error("Error fetching seller profile jobs:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  GetBuyerProfileJobs,
};
