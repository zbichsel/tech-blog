// !-- REQUIRING models --!
const User = require('./User');
const Comment = require('./Comment');
const Blog = require('./Blog');

// !-- Establishing the relationships between the tables --!
User.hasMany( Blog, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

Blog.belongsTo( User, {
    foreignKey: 'user_id'
});

Blog.hasMany( Comment, {
    foreignKey: 'blog_id',
    onDelete: 'CASCADE'
});

Comment.belongsTo( Blog, {
    foreignKey: 'blog_id'
});

User.hasMany( Comment, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

Comment.belongsTo( User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

module.exports = { User, Comment, Blog };