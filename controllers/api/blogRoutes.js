const router = require('express').Router();
const { User, Blog, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// !-- '/api/blogs' endpoint --!
router.get('/api/blogs', (req, res) => res.json({ User, Blog, Comment }));

// !-- Get ALL posts --!
router.get('/', async (req, res) => {
    try {
        const blogData = await Blog.findAll({
            include: [{ model: Comment }]
        });
        res.status(200).json(blogData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// !-- Get SINGLE post by ID --!
router.get('/:id', async (req, res) => {
    try {
        const blogData = await Blog.findByPk(req.params.id, {
            include: [{ model: User }, { model: Comment }]
        });

        if (!blogData) {
            res.status(404).json({ message: 'No blog with this ID.'});
            return;
        }
        res.status(200).json(blogData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// !-- CREATE new post when user is logged in --!
router.post('/', withAuth, async (req, res) => {
    try {
        const newBlog = await Blog.create({
            ...req.body,
            user_id: req.session.user_id,
        });
        res.status(200).json(newBlog);
    } catch (err) {
        res.status(400).json(err);
    }
});

// !-- UPDATE post by ID when user is logged in --!
router.put('/:id', withAuth, async (req, res) => {
    try {
        await Blog.update(req.body, {
            where: {
                id: req.params.id,
                user_id: req.session.user_id
            }
        })
        const blogData = await Blog.findByPk(req.params.id);
        if (!blogData) {
            res.status(404).json({ message: 'No post with this ID.'});
            return;
        }
        res.status(200).json(blogData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// !-- DELETE post when user is logged in --!
router.delete('/:id', withAuth, async (req, res) => {
    try {
        const blogData = await Blog.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id
            },
        });
        if (!blogData) {
            res.status(404).json({ message: 'No post found with this ID.'});
            return;
        }
        res.status(200).json(blogData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;