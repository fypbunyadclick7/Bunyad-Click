const sequelize = require('../utils/database').sequelize;  // Your Sequelize instance
const Category = require('./Category');
const SubCategory = require('./SubCategory');
const Jobs = require('./Jobs');
const JobSkills = require('./JobSkills');
const Bids = require('./Bids');
const BidAttachments = require('./BidAttachments');
const Offer = require('./Offers');  // Import the Offer model

// Define associations
// Category and SubCategory
Category.hasMany(SubCategory, {
    foreignKey: 'CategoryId',
    as: 'SubCategories',
});
SubCategory.belongsTo(Category, {
    foreignKey: 'CategoryId',
    as: 'Category',
});

// Jobs and Category
Category.hasMany(Jobs, {
    foreignKey: 'CategoryId',
    as: 'Jobs',
});
Jobs.belongsTo(Category, {
    foreignKey: 'CategoryId',
    as: 'Category',
});

// Jobs and SubCategory
SubCategory.hasMany(Jobs, {
    foreignKey: 'SubCategoryId',
    as: 'Jobs',
});
Jobs.belongsTo(SubCategory, {
    foreignKey: 'SubCategoryId',
    as: 'SubCategory',
});

// Jobs and JobSkills
Jobs.hasMany(JobSkills, {
    foreignKey: 'JobId',
    as: 'Skills',
});
JobSkills.belongsTo(Jobs, {
    foreignKey: 'JobId',
    as: 'Job',
});

// Jobs and Bids
Jobs.hasMany(Bids, {
    foreignKey: 'JobId',
    as: 'Bids',
});
Bids.belongsTo(Jobs, {
    foreignKey: 'JobId',
    as: 'Job',
});

// Bids and BidAttachments
Bids.hasMany(BidAttachments, {
    foreignKey: 'BidId',
    as: 'Attachments',
    onDelete: 'CASCADE',
});
BidAttachments.belongsTo(Bids, {
    foreignKey: 'BidId',
    as: 'Bid',
});

// Jobs and Offers
Jobs.hasMany(Offer, {
    foreignKey: 'JobId',
    as: 'Offers',
});
Offer.belongsTo(Jobs, {
    foreignKey: 'JobId',
    as: 'Job',
});

// Export models with associations
module.exports = {
    sequelize,
    Category,
    SubCategory,
    Jobs,
    JobSkills,
    Bids,
    BidAttachments,
    Offer,  // Export Offer model
};
