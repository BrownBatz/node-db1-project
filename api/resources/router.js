const express = require('express');

const db = require('../../data/dbConfig.js');

const router = express.Router();

// Create
router.post('/', (req, res) => {
    if (req.body.name && req.body.budget){
        db("accounts").insert({name: req.body.name, budget: req.body.budget})
            .then(res => {
                res.status(201).json({success: "The new object has been created, please refresh your list."})
            })
            .catch(err => {
                res.status(500).json(err);
            })
    } else {
        res.status(400).json({errorMessage: "Please provide a name and a budget for the new account"});
    }
});


// Read
router.get('/', (req, res) => {
    db('accounts')
        .then(accounts => {
            res.status(200).json(accounts);
        })
        .catch(err => {
            res.status(500).json({errorMessage: "There was an error with getting that data from the database"})
        });
});

router.get('/:id', (req, res) => {
    const id = req.params.id;

    db.select('*').from('accounts').where({ id: id })
        .then(account => {
            if (account.length < 1){
                res.status(404).json({errorMessage: "No account with that id could be found"});
            } else {
                res.status(200).json(account);
            }
        })
        .catch(error => {
            res.status(500).json({errorMessage: "There was an error with retrieving that data from the server"});
        })
});

/* 
I keep getting this error with the update functions. I am not sure why but the calls work it just sends this back every time
*/

// Update
router.patch("/:id", (req, res) => {
    const id = req.params.id;
    if (req.body.name && req.body.budget){
        // if both name and budget needs updated
            db("accounts").where({ id: id }).update({ name: req.body.name, budget: req.body.budget }, ['id', 'name', 'budget'])
                .then(response => {
                    res.status(200).json({successMessage: `The update was successful ${response}`});
                })
                .catch(err => {
                    res.status(500).json({errorMessage: "There was an error with the server"});
                });
    } else if (req.body.budget){
        // if only budget needs updated
        db("accounts").where({ id: id }).update({ budget: req.body.budget })
            .then(response => {
                res.status(200).json({successMessage: `The update was successful ${response}`});
            })
            .catch(err => {
                res.status(500).json({errorMessage: "There was an error with the server"});
            });
    } else if (req.body.name){
        // if only name
            db("accounts").where({ id: id }).update({ name: req.body.name })
            .then(response => {
                res.status(200).json({successMessage: `The update was successful ${response}`});
            })
            .catch(err => {
                res.status(500).json({errorMessage: "There was an error with the server"});
            });
    } else {
        // if incorrect parameters were provided
        res.status(400).json({errorMessage: "Please be sure you either specify budget, name, or both to update with a valid ID"});
    }

});


// Delete
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    db('accounts').where({id: id}).del()
        .then(response => {
            res.status(200).json({successMessage: `The delete request has gone through and you have effected ${response} rows`})
        })
        .catch(err => {
            res.status(500).json({errorMessage: "There was an error with deleting that item"});
        });
});

module.exports = router;