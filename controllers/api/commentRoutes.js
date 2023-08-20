const router = require('express').Router();
const { User, Blog, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// !-- '/api/comments' endpoint --!
router.get('/api/comments', (req, res) => res.json({ User, Blog, Comment }));

// !-- Get ALL comments --!
router.get('/', async (req, res) => {
    try {
        const commentData = await Comment.findAll({
            include: [{ Blog }] //idk if i need this yet;
        });

        res.status(200).json(commentData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// !-- CREATE comment when user is logged in --!
router.post('/', withAuth, async (req, res) => {
    try {
        const commentData = await Comment.create({
            ...req.body,
            user_id: req.session.user_id,
        });

        res.status(200).json(commentData);
    } catch (err) {
        res.status(400).json(err);
    }
});

// !-- UPDATE comment by ID when user is logged in --!
router.put('/:id', withAuth, async (req, res) => {
    try {
        await Comment.update(req.body, {
            where: {
                id: req.params.id,
                user_id: req.session.user_id
            }
        })
        const commentData = await Comment.findByPk(req.params.id);
        if (!commentData) {
            res.status(404).json({ message: 'No comment with this ID.'});
            return;
        }
        res.status(200).json(commentData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// !-- DELETE comment when user is logged in --!
router.delete('/:id', withAuth, async (req, res) => {
    try {
        const commentData = await Comment.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id
            },
        });
        if (!commentData) {
            res.status(404).json({ message: 'No comment with this ID.'});
            return;
        }
        res.status(200).json(commentData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;