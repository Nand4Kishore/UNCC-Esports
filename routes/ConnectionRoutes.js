const express = require('express');
const controller= require('../controllers/connectionController');
const router = express.Router();
const {isLoggedIn, isAuthor} = require('../middlewares/auth');
const{validateId,validateStory,validateResult} = require('../middlewares/validator');

// router.get('/', controller.index);
router.get('/index', controller.index);

router.get('/', controller.connections);

router.get('/newconnection',isLoggedIn,controller.new);
router.get('/savedConnections',isLoggedIn, controller.getSavedConnections);

router.post('/',isLoggedIn,validateStory,validateResult,controller.create);

router.get('/:id',validateId,controller.show);
 
router.get('/:id/update',validateId, isLoggedIn,isAuthor,controller.edit);

router.put('/:id',validateId, isLoggedIn,isAuthor,validateStory,validateResult,controller.update);

router.delete('/:id',validateId, isLoggedIn,isAuthor,controller.delete);

module.exports = router;    