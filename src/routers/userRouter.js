const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const router = express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');

const avatar = multer({
    // limits: {
    //     fileSize: 3000000,
    // },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|JPG|jpeg|png)$/)) {
            cb(new Error('Please upload a jpg file'))
        }

        cb(undefined, true)
    }
})

router.post('/users', async (req, res) => {
    try {
        const user = await new User(req.body)
        await user.save()
        const token = await user.generateToken();
        res.status(201).send({user, token})
    } catch (err) {
        res.status(400).send(err)
    }
})

router.get('/users', auth, async (req, res) => {
    try {
        const data = await User.find({})
        res.send(data)
    } catch (err) {
        res.send(err)
    }
})

router.get('/user/me', auth, async (req, res) => {
    try {
        res.send(req.user)
    } catch (err) {
        res.send(err)
    }
})

router.get('/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (err) {
        res.status(404).send(err)
    }
})

router.patch('/user/me', auth, async (req, res) => {
    const updateAllowed = ['name', 'email', 'age', 'password']
    const incomingUpdates = Object.keys(req.body)

    const isValidUpdate = incomingUpdates.every((item)=>updateAllowed.includes(item))

    if (!isValidUpdate) {
        return res.status(404).send({'error': 'update value does not exists!'})
    }

    try {
        incomingUpdates.forEach(item=>{
            req.user[item] = req.body[item]
        })
        await req.user.save()
        res.send(req.user)
    } catch (err) {
        res.status(404).send(err)
    }
})

router.delete('/user/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (err) {
        res.status(404).send(err)
    }
})

router.post('/user/me/image', auth, avatar.single('image'), async(req, res) => {
    try {
        const buffer = await sharp(req.file.buffer).resize({width: 400, height: 400}).png().toBuffer()
        req.user.image = buffer
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(400).send()
    }
}, (error, req, res, next) => {
    res.status(403).send({
        error: error.message
    })
})

router.delete('/user/me/image', auth, async(req, res) => {
    try {
        req.user.image = undefined
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(400).send()
    }
})

router.get('/user/:id/image', async(req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.image) {
            return res.send(404).send()
        }

        res.set('Content-type', 'image/JPG')
        res.send(user.image)

    } catch (e) {
        res.status(404).send()
    }
})

router.post('/user/login', async (req, res) => {
    try {
        const user = await User.findByCredential(req.body.email, req.body.password)
        const token = await user.generateToken();
        res.send({
            user,
            token
        })
    } catch (err) {
        res.status(404).send(err)
    }
})

router.post('/user/logout', auth, async (req, res) => {
    try {
        req.user.token = req.user.token.filter(item=>{
            return item.token !== req.token
        })
        await req.user.save()
        res.send('logout successful!')
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/user/logout/all', auth, async (req, res) => {
    try {
        req.user.token = []
        await req.user.save()
        res.send('logout for all successful!')
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router;