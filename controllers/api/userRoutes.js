const router = require('express').Router();
const { User, Blog, Comment } = require('../../models');

// !-- '/api/users' endpoint --!
router.get('/api/users', (req, res) => res.json({ User, Blog, Comment }));

// !-- Get ALL users --!
router.get('/', async (req, res) => {
    try {
        const userData = await User.findAll({
            include: [{ model: Blog }, { model: Comment }]
        });
        
        res.status(200).json(userData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// !-- Get SINGLE user --!
router.get('/:id', async (req, res) => {
    try {
        const userData = await User.findByPk(req.params.id, {
            include: [{ model: Blog }, { model: Comment }]
        });

        if (!userData) {
            res.status(404).json({ message: 'No user with this ID!'});
            return;
        }
        res.status(200).json(userData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// !-- Get SINGLE user && return all BLOGS --!
router.get('/loggedin', async (req, res) => {
    try {
        const userData = await User.findByPk(req.session.user_id, {
            include: [{ model: Blog }, { model: Comment }]
        });

        if (!userData) {
            res.status(404).json({ message: 'No user with this ID!'});
            return;
        }
        res.status(200).json(userData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// !-- CREATE user --!
router.post('/', async (req, res) => {
    try {
        const userData = await User.create(req.body);

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;

            res.status(200).json(userData);
        });
    } catch (err) {
        res.status(400).json(err);
    }
});

// !-- User LOGIN --!
router.post('/login', async (req, res) => {
    try {
        const userData = await User.findOne({ where: { email: req.body.email }});

        if (!userData) {
            res.status(400).json({ message: 'Incorrect email or password, please try again.'});
            return;
        }

        const validPassword = userData.checkPassword(req.body.password); //removed an await here//

        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect email or password, please try again.'});
            return;
        }

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;

            res.json({ user: userData, message: 'You are now logged in!'});
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// !-- User LOGOUT--!
router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

module.exports = router;