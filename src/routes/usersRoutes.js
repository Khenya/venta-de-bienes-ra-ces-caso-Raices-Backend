const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.get('/', usersController.getAllUsers);
router.get('/:id', usersController.getUserById);
router.put('/:id', usersController.updateUser);
router.delete('/:id', usersController.deleteUser);
router.post('/', usersController.createUser);

module.exports = router;