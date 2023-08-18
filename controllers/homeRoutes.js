const router = require('express').Router();
const { User, Comment, Blog } = require ('../models');
// !-- add withAuth file here --!

// !-- Get all blogs --!
router.get('/', async (req, res) => {
    try {
        // !-- Get all projects and JOIN with user data --!
        const blogData = await Blog.findAll({
            include: [{ model: User, Blog, Comment, attributes: ['name']}]
        });

        // !-- Serialize data so template can read it --!
        const blogs = blogData.map((blog) => blog.get({ plain: true }));

        // !-- Pass serialized data and session flag into template --!
        res.render('homepage', {
            blogs,
            logged_in: req.session.logged_in
        });

    } catch (err) {
        res.status(500).json(err);
    }
});

// !-- get blog by ID --!
router.get('/blog/:id', async (req, res) => {
    try {
        const blogData = await Blog.findByPk(req.params.id, {
            include: [{ model: User, attributes: ['name']}]
        });

        const blog = blogData.get({ plain: true });

        res.render('blog', {
            ...blog,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// !-- Use withAuth middleware to prevent access to route --!
router.get('/dashboard', withAuth, async (req, res) => {
    try {
        // !-- Find logged in user based on session ID --!
        const userData = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ['password']},
            include: [{ model: Blog }],
        });

        const user = userData.get({ plain: true });

        res.render('profile', {
            ...user,
            logged_in: true
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/login', (req, res) => {
    // !-- If user already logged in, redirect the request to /profile --!
    if (req.session.logged_in) {
        res.redirect('/profile');
        return;
    }

    res.render('login');
});

module.exports = router;