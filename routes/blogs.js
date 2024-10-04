const { Router } = require('express');
const path = require('path');
const multer = require('multer');
const mongoose = require('mongoose');

const Post = require('../models/posts');
const Comment = require('../models/comments');

const router = Router();

// Multer storage & upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/uploads`));
    },
    filename: function (req, file, cb) {
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename);
    }
});
const upload = multer({ storage: storage });

router.get('/add', (req, res) => {
    return res.render('addPost', {
        user: req.user
    });
});

router.post('/add', upload.single('postImageUrl'), async (req, res) => {
    const { title, body } = req.body;
    const post = await Post.create({
        title,
        body,
        createdBy: req.user._id,
        postImageUrl: `/uploads/${req.file.filename}`
    });
    return res.redirect('/');
});

router.get('/:id', async (req, res) => {
    const blogId = req.params.id;

    // Validate ObjectId
    if (!mongoose.isValidObjectId(blogId)) {
        return res.status(400).json({ error: 'Invalid blog ID format' });
    }

    const blog = await Post.findById(blogId).populate("createdBy").sort({ createdAt: -1 });
    const comments = await Comment.find({ blogId }).populate("createdBy").sort({ createdAt: -1 });
    res.render('blog', {
        user: req.user,
        comments,
        blog
    });
});

router.post('/comment/:id', async (req, res) => {
    const blogId = req.params.id;

    // Validate ObjectId
    if (!mongoose.isValidObjectId(blogId)) {
        return res.status(400).json({ error: 'Invalid blog ID format' });
    }

    await Comment.create({
        content: req.body.comment,
        createdBy: req.user._id, // Use req.user._id
        blogId
    });

    return res.redirect(`/blog/${blogId}`);
});

module.exports = router;
