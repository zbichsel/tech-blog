const sequelize = require('../config/connection');
const { User, Blog, Comment } = require('../models');

const userData = require('./userData.json');
const blogData = require('./blogData.json');
const commentData = require('./commentData.json');

const seedDatabase = async () => {
    await sequelize.sync({ force: true });

    const seed = async () => {
        await User.bulkCreate(userData);
        await Blog.bulkCreate(blogData);
        await Comment.bulkCreate(commentData);
        await process.exit(0);
    };

    seed();
};

seedDatabase();