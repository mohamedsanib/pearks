const {Router} = require('express');
const User = require('../models/user');

const router = Router();

router.get('/signin', (req, res)=>{
    return res.render("signin");
})
router.get('/signup', (req, res)=>{
    return res.render("signup");
})

router.post('/signup', async(req, res)=>{
    const { fullName, email, password} = req.body;
    await User.create({
        fullName,
        email,
        password,
    });
    return res.redirect('/');
})

router.post('/signin', async(req, res)=>{
    const { email, password} = req.body;
    try{
        const userToken = await User.matchPasswordAndGenarateToken(email, password);  
        return res.status(200).cookie('token', userToken).redirect('/');
    }catch(error){
        return res.render("signin", {
            error : "Incorrect Email or password"
        })
    }
})

router.get('/logout', (req, res)=>{
    res.clearCookie('token').redirect('/');
});

module.exports = router;  