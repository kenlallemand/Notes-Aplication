const router = require('express').Router();
//Modelo de datos para la sb
const Note = require('../models/Note');
//proteccion de rutas
const { isAuthenticated } = require('../helpers/auth');

router.get('/notes/add', isAuthenticated, (req, res) => {
    res.render('notes/new-notes');
}); 

router.post('/notes/new-note', isAuthenticated, async (req, res) => {
    const { title, description } = req.body;
    const errors = [];
    if (!title) {     
        errors.push({ text: 'please write a tittle' });
    }
    if (!description) {
        errors.push({text: 'please write a description' });
    }
    if (errors.length > 0) {
        res.render('notes/new-notes', {
            errors,
            title,
            description
        });
    } else {
        const newNode = new Note({ title, description });
        newNode.user = req.user.id;
        await newNode.save();
        req.flash('success_msg', 'Note Added Sucessfully');
        res.redirect('/notes');
    }
});

router.put('/notes/edit-note/:id', isAuthenticated, async (req, res) => {
    const { title, description } = req.body;
    await Note.findByIdAndUpdate(req.params.id, { title, description });
    console.log('basura1');
    res.flash('success_msg', 'Note Updated Successfully');
    res.redirect('/notes');
});

router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => {
    console.log(req.params.id);
    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Note Removed Successfully');
    res.redirect('/notes');
    
})

router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {
    const note = await Note.findById(req.params.id);
    res.render('notes/edit-notes',{note});  
})

router.get('/notes', isAuthenticated, async (req, res) => {
    const notes = await Note.find({user: req.user.id}).sort({date: 'desc'});
    res.render('notes/all-notes', { notes });
})
module.exports = router;