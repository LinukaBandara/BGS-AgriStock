const express = require("express");
const db = require("../db");

const router = express.Router();

/* =========================================================
   GET ALL PRODUCTS
========================================================= */

router.get("/", (req, res) => {
  const sql = `
    SELECT
      id,
      name,
      category,
      category_sinhala AS categorySinhala,
      size,
      invoice,
      DATE_FORMAT(expiry, '%Y-%m-%d') AS expiry,
      received,
      balance,
      minimum_stock AS minimum,
      unit_price AS unitPrice,
      created_at AS createdAt
    FROM products
    ORDER BY created_at DESC, id DESC
  `;

  db.query(sql, (error, results) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: "Unable to load products.",
        error: error.message,
      });
    }

    const products = results.map((product) => ({
      ...product,
      received: Number(product.received || 0),
      balance: Number(product.balance || 0),
      minimum: Number(product.minimum || 0),
      unitPrice: Number(product.unitPrice || 0),
    }));

    return res.json({
      success: true,
      products,
    });
  });
});

/* =========================================================
   ADD PRODUCT
========================================================= */

router.post("/", async (req, res) => {
  const {
    category,
    categorySinhala,
    productName,
    size,
    invoiceNumber,
    expiryDate,
    receivedQuantity,
    minimum = 5,
    unitPrice = 0,
  } = req.body;

  const quantity = Number(receivedQuantity);
  const minimumStock = Number(minimum);
  const price = Number(unitPrice);

  if (
    !category ||
    !productName?.trim() ||
    !size?.trim() ||
    !invoiceNumber?.trim() ||
    !expiryDate
  ) {
    return res.status(400).json({
      success: false,
      message: "Please complete all required product fields.",
    });
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    return res.status(400).json({
      success: false,
      message:
        "Received quantity must be a whole number greater than zero.",
    });
  }

  if (!Number.isInteger(minimumStock) || minimumStock < 0) {
    return res.status(400).json({
      success: false,
      message:
        "Minimum stock must be a whole number of zero or more.",
    });
  }

  if (!Number.isFinite(price) || price < 0) {
    return res.status(400).json({
      success: false,
      message: "Unit price cannot be negative.",
    });
  }

  let connection;

  try {
    connection = await db.promise().getConnection();

    await connection.beginTransaction();

    const [productResult] = await connection.query(
      `
        INSERT INTO products (
          name,
          category,
          category_sinhala,
          size,
          invoice,
          expiry,
          received,
          balance,
          minimum_stock,
          unit_price
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        productName.trim(),
        category,
        categorySinhala || category,
        size.trim(),
        invoiceNumber.trim(),
        expiryDate,
        quantity,
        quantity,
        minimumStock,
        price,
      ]
    );

    const productId = productResult.insertId;

    const [activityResult] = await connection.query(
      `
        INSERT INTO activities (
          type,
          product_id,
          product_name,
          size,
          quantity,
          balance,
          message
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        "product-added",
        productId,
        productName.trim(),
        size.trim(),
        quantity,
        quantity,
        `Added ${productName.trim()} ${size.trim()}`,
      ]
    );

    await connection.commit();

    return res.status(201).json({
      success: true,
      message: `${productName.trim()} ${size.trim()} added successfully.`,

      product: {
        id: productId,
        name: productName.trim(),
        category,
        categorySinhala:
          categorySinhala || category,
        size: size.trim(),
        invoice: invoiceNumber.trim(),
        expiry: expiryDate,
        received: quantity,
        balance: quantity,
        minimum: minimumStock,
        unitPrice: price,
        createdAt: new Date().toISOString(),
      },

      activity: {
        id: activityResult.insertId,
        type: "product-added",
        productId,
        productName: productName.trim(),
        size: size.trim(),
        quantity,
        balance: quantity,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error(
          "Add product rollback failed:",
          rollbackError.message
        );
      }
    }

    if (
      error.code === "ER_DUP_ENTRY" ||
      error.errno === 1062
    ) {
      return res.status(409).json({
        success: false,
        message:
          "This product and size already exist. Use Restock Product instead.",
      });
    }

    console.error("Add product error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to save the product.",
      error: error.message,
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

/* =========================================================
   SELL PRODUCT / UPDATE STOCK
========================================================= */

router.patch("/:id/sell", async (req, res) => {
  const productId = Number(req.params.id);
  const soldQuantity = Number(req.body.soldQuantity);

  if (!Number.isInteger(productId) || productId <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid product ID.",
    });
  }

  if (
    !Number.isInteger(soldQuantity) ||
    soldQuantity <= 0
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Sold quantity must be a whole number greater than zero.",
    });
  }

  let connection;

  try {
    connection = await db.promise().getConnection();

    await connection.beginTransaction();

    const [results] = await connection.query(
      `
        SELECT
          id,
          name,
          size,
          balance
        FROM products
        WHERE id = ?
        FOR UPDATE
      `,
      [productId]
    );

    if (results.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "Product could not be found.",
      });
    }

    const product = results[0];

    const currentBalance = Number(
      product.balance || 0
    );

    if (soldQuantity > currentBalance) {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message:
          "Sold quantity cannot exceed the current balance.",
      });
    }

    const newBalance =
      currentBalance - soldQuantity;

    await connection.query(
      `
        UPDATE products
        SET balance = ?
        WHERE id = ?
      `,
      [newBalance, productId]
    );

    const [activityResult] = await connection.query(
      `
        INSERT INTO activities (
          type,
          product_id,
          product_name,
          size,
          quantity,
          balance,
          message
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        "stock-updated",
        productId,
        product.name,
        product.size,
        soldQuantity,
        newBalance,
        `Sold ${soldQuantity} units of ${product.name} ${product.size}`,
      ]
    );

    await connection.commit();

    return res.json({
      success: true,
      message:
        `${product.name} ${product.size} updated successfully.`,

      newBalance,

      activity: {
        id: activityResult.insertId,
        type: "stock-updated",
        productId,
        productName: product.name,
        size: product.size,
        quantity: soldQuantity,
        balance: newBalance,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error(
          "Stock update rollback failed:",
          rollbackError.message
        );
      }
    }

    console.error("Stock update error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update stock.",
      error: error.message,
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

/* =========================================================
   RESTOCK EXISTING PRODUCT
========================================================= */

router.patch("/:id/restock", async (req, res) => {
  const productId = Number(req.params.id);

  const {
    restockQuantity,
    invoiceNumber,
    expiryDate,
    unitPrice,
  } = req.body;

  const quantity = Number(restockQuantity);
  const price = Number(unitPrice);

  if (!Number.isInteger(productId) || productId <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid product ID.",
    });
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    return res.status(400).json({
      success: false,
      message:
        "Restock quantity must be a whole number greater than zero.",
    });
  }

  if (!invoiceNumber?.trim() || !expiryDate) {
    return res.status(400).json({
      success: false,
      message:
        "Invoice number and expiry date are required.",
    });
  }

  if (!Number.isFinite(price) || price < 0) {
    return res.status(400).json({
      success: false,
      message: "Unit price cannot be negative.",
    });
  }

  let connection;

  try {
    connection = await db.promise().getConnection();

    await connection.beginTransaction();

    const [results] = await connection.query(
      `
        SELECT
          id,
          name,
          size,
          received,
          balance
        FROM products
        WHERE id = ?
        FOR UPDATE
      `,
      [productId]
    );

    if (results.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "Product could not be found.",
      });
    }

    const product = results[0];

    const newReceived =
      Number(product.received || 0) + quantity;

    const newBalance =
      Number(product.balance || 0) + quantity;

    await connection.query(
      `
        UPDATE products
        SET
          received = ?,
          balance = ?,
          invoice = ?,
          expiry = ?,
          unit_price = ?
        WHERE id = ?
      `,
      [
        newReceived,
        newBalance,
        invoiceNumber.trim(),
        expiryDate,
        price,
        productId,
      ]
    );

    const [activityResult] = await connection.query(
      `
        INSERT INTO activities (
          type,
          product_id,
          product_name,
          size,
          quantity,
          balance,
          message
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        "stock-restocked",
        productId,
        product.name,
        product.size,
        quantity,
        newBalance,
        `Restocked ${quantity} units of ${product.name} ${product.size}`,
      ]
    );

    await connection.commit();

    return res.json({
      success: true,
      message:
        `${product.name} ${product.size} restocked successfully.`,

      product: {
        id: productId,
        received: newReceived,
        balance: newBalance,
        invoice: invoiceNumber.trim(),
        expiry: expiryDate,
        unitPrice: price,
      },

      activity: {
        id: activityResult.insertId,
        type: "stock-restocked",
        productId,
        productName: product.name,
        size: product.size,
        quantity,
        balance: newBalance,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error(
          "Restock rollback failed:",
          rollbackError.message
        );
      }
    }

    console.error("Restock error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to restock product.",
      error: error.message,
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

module.exports = router;