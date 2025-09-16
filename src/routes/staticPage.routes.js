const express = require('express');
const staticPageController = require('../controllers/staticPage.controller');

const router = express.Router();

router.route('/')
    .get(staticPageController.getAllStaticPages)
    .post(staticPageController.createStaticPage);

router.route('/:id')
    .get(staticPageController.getStaticPageById)
    .put(staticPageController.updateStaticPage)
    .delete(staticPageController.deleteStaticPage);

module.exports = router;
