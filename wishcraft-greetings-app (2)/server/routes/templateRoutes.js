const express = require('express');
const router = express.Router();
const { getTemplates, getTemplate, createTemplate, updateTemplate, deleteTemplate, trackAction } = require('../controllers/templateController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getTemplates);
router.get('/:id', protect, getTemplate);
router.post('/', protect, adminOnly, createTemplate);
router.put('/:id', protect, adminOnly, updateTemplate);
router.delete('/:id', protect, adminOnly, deleteTemplate);
router.post('/track', protect, trackAction);

module.exports = router;
