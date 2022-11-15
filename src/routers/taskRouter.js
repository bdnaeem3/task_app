const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const auth = require('../middleware/auth');


router.post('/tasks', auth, async (req, res) => {
    try {
        const task = await new Task({
            ...req.body,
            creator: req.user.id
        });
        await task.save()
        res.status(201).send(task)
    } catch (err) {
        res.status(400).send(err)
    }
})

router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt((req.query.page - 1) * req.query.limit),
                sort
            }
        })
        res.send(req.user.tasks)
    } catch (err) {
        res.status(500).send(err)
    }
})

router.get('/task/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            creator: req.user._id
        })
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (err) {
        res.status(404).send(err)
    }
})

router.patch('/task/:id', auth, async (req, res) => {
    const updateAllowed = ['description', 'completed']
    const incomingUpdates = Object.keys(req.body)

    const isValidUpdate = incomingUpdates.every((item)=>updateAllowed.includes(item))

    if (!isValidUpdate) {
        return res.status(404).send({'error': 'update value does not exists!'})
    }

    try {
        const task = await Task.findOne({ _id:  req.params.id, creator: req.user._id})
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        if (!task) return res.status(404).send()
        updateAllowed.forEach(update=>task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (err) {
        res.status(404).send(err)
    }
})

router.delete('/task/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOne({_id:req.params.id, creator: req.user._id})
        task.remove()
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router;