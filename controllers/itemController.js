const pool = require('../config/database');

// GET /items - Retrieve all items
const getAllItems = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM items ORDER BY created_at DESC'
    );
    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /items/:id - Retrieve single item
const getItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM items WHERE id = ?', [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Item not found.' });
    }
    res.status(200).json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST /items - Create new item
const createItem = async (req, res) => {
  const { name, description, price, quantity, status } = req.body;

  // Validation
  if (!name || name.trim() === '') {
    return res.status(400).json({ success: false, error: 'Name is required.' });
  }
  if (price === undefined || isNaN(price) || price < 0) {
    return res.status(400).json({ success: false, error: 'Valid price is required.' });
  }
  if (quantity === undefined || isNaN(quantity) || quantity < 0) {
    return res.status(400).json({ success: false, error: 'Valid quantity is required.' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO items (name, description, price, quantity, status)
       VALUES (?, ?, ?, ?, ?)`,
      [name.trim(), description || null, price, quantity, status || 'active']
    );
    res.status(201).json({
      success: true,
      message: 'Item created successfully.',
      data: { id: result.insertId, name, description, price, quantity, status }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// PUT /items/:id - Update existing item
const updateItem = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, quantity, status } = req.body;

  // Validation
  if (!name || name.trim() === '') {
    return res.status(400).json({ success: false, error: 'Name is required.' });
  }
  if (price === undefined || isNaN(price) || price < 0) {
    return res.status(400).json({ success: false, error: 'Valid price is required.' });
  }
  if (quantity === undefined || isNaN(quantity) || quantity < 0) {
    return res.status(400).json({ success: false, error: 'Valid quantity is required.' });
  }

  try {
    const [existing] = await pool.query(
      'SELECT * FROM items WHERE id = ?', [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: 'Item not found.' });
    }

    await pool.query(
      `UPDATE items SET name = ?, description = ?, price = ?, quantity = ?, status = ?
       WHERE id = ?`,
      [name.trim(), description || null, price, quantity, status || 'active', id]
    );

    res.status(200).json({
      success: true,
      message: 'Item updated successfully.',
      data: { id: parseInt(id), name, description, price, quantity, status }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// DELETE /items/:id - Delete item
const deleteItem = async (req, res) => {
  const { id } = req.params;
  try {
    const [existing] = await pool.query(
      'SELECT * FROM items WHERE id = ?', [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: 'Item not found.' });
    }

    await pool.query('DELETE FROM items WHERE id = ?', [id]);

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully.'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { getAllItems, getItemById, createItem, updateItem, deleteItem };