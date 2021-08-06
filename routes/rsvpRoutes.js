const express = require('express');
const router = express.Router();

const rsvpController = require('../controllers/rsvpController');
const { isLoggedIn, isIn} = require('../middlewares/auth');

router.put('/:id/:action/updateRsvp', isLoggedIn, isIn, rsvpController.updateRsvp);

router.get('/:id/update', rsvpController.getUpdateRsvp);

router.delete('/:id', rsvpController.deleteRsvp);

module.exports = router;