const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
} = require('../controllers/itemController');

// All routes below are protected by JWT
router.get('/',      verifyToken, getAllItems);
router.get('/:id',   verifyToken, getItemById);
router.post('/',     verifyToken, createItem);
router.put('/:id',   verifyToken, updateItem);
router.delete('/:id',verifyToken, deleteItem);

module.exports = router;