const Job = require('../models/Jobs');  // Import the Job model
const JobSkill = require('../models/JobSkills');  // Import the JobSkill model
const { sequelize } = require('../utils/database');

// Controller to post a new job
const PostJob = async (req, res) => {
    const { UserId, Title, Timeline, Budget, Description, CategoryId, SubCategoryId, Skills } = req.body;

    // Start a transaction
    const t = await sequelize.transaction();

    try {
        // Check if required fields are provided
        if (!UserId || !Title || !Timeline || !Budget || !CategoryId || !SubCategoryId) {
            return res.status(400).json({ message: 'Required fields are missing.' });
        }

        // Create a new job
        const newJob = await Job.create({
            UserId,
            Title,
            Timeline,
            Budget,
            Description,
            CategoryId,
            SubCategoryId
        });

        // If skills are provided, insert them into JobSkills
        if (Skills && Array.isArray(Skills) && Skills.length > 0) {
            const jobSkills = Skills.map(skill => ({
                JobId: newJob.Id,
                Title: skill
            }));
            // Insert multiple skills into JobSkills table
            await JobSkill.bulkCreate(jobSkills);
        }
        // Commit the transaction
        await t.commit();

        return res.status(201).json({ message: 'Job created successfully.', job: newJob });
    } catch (error) {
        await t.rollback();
        console.error('Error posting job:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = {
    PostJob
};