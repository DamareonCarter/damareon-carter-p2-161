import express, { json } from 'express';
import connectDatabase from '../config/db.js';
import { check, validationResult } from 'express-validator';
import cors from 'cors';
import User from './models/Users.js';
import bcryptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import config  from 'config';
import auth from "./middleware/auth.js";
import Note from "./models/Note.js";

let app = express();

connectDatabase();

app.use(json({ extended: false }));
app.use(cors({ origin: "http://localhost:3000" }));

app.get('/', (req, res) => res.send("HTTP GET request sent to root API endpoint"));
app.get('/api/auth', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).send("Unkown server error");
    }
});
app.get('/api/notes', auth, async (req, res) => {
    try {
        const notes = await Note.find();
        res.json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});
app.post('/api/users',
    [
        check('name', "Please enter your name").not().isEmpty(),
        check('email', "Please enter a valid email").isEmail(),
        check('password', "Please enter a password with 6 or more characters").isLength({ min: 6 })
    ],
    async (req, res) => 
    {
        const errors = validationResult(req);

        if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
        else
        {
            const { name, email, password } = req.body;

            try
            {
                let user = await User.findOne({ email: email});

                if (user)
                {
                    return res.status(400).json({ errors: [{ msg: "User already exists" }] });
                }

                user = new User({ name: name, email: email, password: password });
                const salt = await bcryptjs.genSalt(10);
                user.password = await bcryptjs.hash(password, salt);

                await user.save();

                returnToken(user, res);
            } catch (error)
            {
                res.status(500).send("Server error");
            }
        }
    }
);
app.post('/api/login',
    [
        check('email', "Please enter a valid email").isEmail(),
        check('password', "A password is required").exists()
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        } else {
            const { email, password } = req.body;

            try {
                let user = await User.findOne({ email: email });

                if (!user) {
                    return res.status(400).json({ errors: [{ msg: "Invalid email or password" }]});
                }

                const match = await bcryptjs.compare(password, user.password);
                if (!match) {
                    return res.status(400).json({ errors: [{ msg: "Invalid email or password" }]});
                }

                returnToken(user, res);
            } catch (error) {
                res.status(500).send("Server error");
            }
        }
    }
);
app.post('/api/notes',
    [
        auth,
        [
            check('title', "Title text is required").not().isEmpty(),
            check('text', "Body text is required").not().isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        } else {
            const { title, text } = req.body;

            try {
                let user = await User.findById(req.user.id);

                const note = new Note({
                    user: user.id,
                    title: title,
                    text: text
                });

                await note.save();

                res.json(note);
            } catch (error) {
                console.error(error);
                res.status(500).send("Server error");
            }
        }
    }
);
app.put('/api/notes/:id', auth, async (req, res) => {
    try {
        const { title, text } = req.body;
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ msg: "Note not found" });
        }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: "User not authorized" });
        }

        note.title = title || note.title;
        note.text = text || note.text;

        await note.save();

        res.json(note);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});
app.delete('/api/notes/:id', auth, async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ msg: "Note not found" });
        }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: "User not authorized" });
        }

        await note.remove();

        res.json({ msg: "Post removed" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

const returnToken = (user, res) => {
    const payload = {
        user: {
            id: user.id
        }
    };

    jsonwebtoken.sign(payload, config.get('jwtSecret'), { expiresIn: '10hr' }, (err, token) => {
        if (err) throw err;
        res.json({ token: token });
    });
};

const PORT = 5000;
app.listen(PORT, () => console.log(`Express server running on port ${PORT}`));