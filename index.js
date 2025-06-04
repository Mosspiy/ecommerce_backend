const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pool = require("./connectDB");

const app = express();
const secret = "mysecret";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/images/");
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + "-" + file.originalname;
    cb(null, fileName);
  },
});

app.use("/images", express.static(path.join(__dirname, "uploads/images")));
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
const upload = multer({ storage });

app.post("/register", async (req, res) => {
  const { username, password, email } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  try {
    let insertQuery = {
      text: `INSERT INTO "user" (email, password) VALUES ($1, $2)`,
      values: [email, passwordHash],
    };
    await pool.query(insertQuery);

    insertQuery = {
      text: `INSERT INTO user_info (username, role, email) VALUES ($1, $2, $3)`,
      values: [username, "user", email],
    };

    await pool.query(insertQuery);
    res.json({ message: "Registered successfully" }).status(200);
  } catch (error) {
    await pool.query(
      `SELECT setval('user_user_id_seq', (SELECT COALESCE(MAX(user_id), 1) FROM "user"))`
    );
    res.json({ message: "Register error" }).status(500);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const query = {
    text: `SELECT * FROM "user" WHERE email = $1`,
    values: [email],
  };
  try {
    const result = await pool.query(query);
    if (result.rows.length === 0) {
      res.json({ message: "User not found" }).status(404);
      return;
    }
    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.json({ message: "Wrong password" }).status(400);
      return;
    }

    const token = jwt.sign({ userId: user.user_id }, secret);
    res.json({ message: "Login success", token }).status(200);
  } catch (error) {
    res.json({ message: "Login error" }).status(500);
  }
});

app.post("/userinfo", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    let authToken;
    if (authHeader) {
      authToken = authHeader.split(" ")[1];
    }
    const user = jwt.verify(authToken, secret);
    const query = {
      text: `SELECT * FROM user_info WHERE user_id = (SELECT user_id FROM "user" WHERE user_id = $1)`,
      values: [user.userId],
    };
    const result = await pool.query(query);
    res.json(result.rows[0]).status(200);
  } catch (error) {
    res.json({ message: "Authentication fail" }).status(403);
  }
});

app.post("/insert_phone", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    let authToken;

    if (authHeader) {
      authToken = authHeader.split(" ")[1];
    }
    const user = jwt.verify(authToken, secret);
    const { phone } = req.body;

    const query = {
      text: `UPDATE user_info SET phone = $1 WHERE user_id = $2`,
      values: [phone, user.userId],
    };
    await pool.query(query);
    res.json({ message: "Insert success" }).status(200);
  } catch (error) {
    res.json({ message: "Insert fail" }).status(403);
  }
});

app.post("/insert_username", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    let authToken;
    if (authHeader) {
      authToken = authHeader.split(" ")[1];
    }
    const user = jwt.verify(authToken, secret);
    const { username } = req.body;

    const query = {
      text: `UPDATE user_info SET username = $1 WHERE user_id = $2`,
      values: [username, user.userId],
    };
    await pool.query(query);
    res.json({ message: "Insert success" }).status(200);
  } catch (error) {
    res.json({ message: "Insert fail" }).status(403);
  }
});

app.post("/insert_address", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    let authToken;
    if (authHeader) {
      authToken = authHeader.split(" ")[1];
    }
    const user = jwt.verify(authToken, secret);
    const { name, lastname, address, phoneads } = req.body;

    const query = {
      text: `UPDATE user_info SET phoneads = $1, name = $2, lastname = $3, address = $4 WHERE user_id = $5`,
      values: [phoneads, name, lastname, address, user.userId],
    };
    await pool.query(query);
    res.json({ message: "Insert success" }).status(200);
  } catch (error) {
    res.json({ message: "Insert fail" }).status(403);
  }
});

app.post("/delete_address", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    let authToken;
    if (authHeader) {
      authToken = authHeader.split(" ")[1];
    }
    const user = jwt.verify(authToken, secret);
    const query = {
      text: `UPDATE user_info SET  name = NULL, lastname = NULL,phoneads = NULL, address = NULL WHERE user_id = $1`,
      values: [user.userId],
    };
    await pool.query(query);
    res.json({ message: "Delete success" }).status(200);
  } catch (error) {
    res.json({ message: "Delete fail" }).status(403);
  }
});

app.post("/insert_item", upload.single("file"), async (req, res) => {
  try {
    const { name, category, price, status, description } = req.body;

    const fileName = req.file.filename;

    const query = {
      text: `INSERT INTO products (name, category, price, "imageUrl", status, "updatedAt" , description) VALUES ($1, $2, $3, $4, $5, NOW(), $6)`,
      values: [
        name,
        category,
        parseInt(price),
        `images/${fileName}`,
        status,
        description,
      ],
    };

    const x = await pool.query(query);
    console.log(x);
    res.json({ message: "Insert item success" }).status(200);
  } catch (error) {
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error("Failed to delete image:", err);
      } else {
        console.log(error);
      }
    });
    res.json({ message: "Insert item fail" }).status(403);
  }
});

app.post("/get_item", async (req, res) => {
  try {
    const { product_id } = req.body;
    const query = {
      text: `SELECT * FROM products WHERE product_id = $1`,
      values: [product_id],
    };
    const result = await pool.query(query);
    res.json(result.rows[0]).status(200);
  } catch (error) {
    res.json({ message: "Get item fail" }).status(403);
  }
});

app.put("/update_item/:id", upload.single("file"), async (req, res) => {
  try {
    const product_id = req.params.id; // Get product_id from URL parameters
    const { name, category, price, status, description } = req.body;

    let query;

    if (req.file) {
      const fileName = req.file.filename;
      query = {
        text: `UPDATE products SET name = $1, category = $2, price = $3, "imageUrl" = $4, status = $5, "updatedAt" = NOW(), description = $6 WHERE product_id = $7`,
        values: [
          name,
          category,
          price,
          `images/${fileName}`,
          status,
          description,
          product_id,
        ],
      };
    } else {
      query = {
        text: `UPDATE products SET name = $1, category = $2, price = $3, status = $4, "updatedAt" = NOW() WHERE product_id = $5`,
        values: [name, category, price, status, product_id],
      };
    }

    await pool.query(query);

    res.json({ message: "Update item success" }).status(200);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.json({ message: "Update item fail" }).status(403);
  }
});

app.get("/products", async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM products`);
    const products = result.rows;
    products.forEach((product) => {
      const date = new Date(product.updatedAt);
      const formattedDate = date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      product.updatedAt = formattedDate;

      product.imageUrl = `${product.imageUrl}`;
    });
    res.json(products).status(200);
  } catch (error) {
    res.json({ message: "Get products error" }).status(500);
  }
});

app.delete("/delete_item", async (req, res) => {
  try {
    const { product_id } = req.body;
    const query = {
      text: `DELETE FROM products WHERE product_id = $1`,
      values: [product_id],
    };
    await pool.query(query);
    res.json({ message: "Delete item success" }).status(200);
  } catch (error) {
    res.json({ message: "Delete item fail" }).status(403);
  }
});

app.post("/add_to_cart", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    let authToken;
    if (authHeader) {
      authToken = authHeader.split(" ")[1];
    }
    const user = jwt.verify(authToken, secret);
    const { product_id, quantity, detail, addons, addonsPrice } = req.body;
    const query = {
      text: `INSERT INTO cart (user_id, product_id, quantity, detail, addons, "addonsPrice") VALUES ($1, $2, $3, $4, $5, $6)`,
      values: [user.userId, product_id, quantity, detail, addons, addonsPrice],
    };
    await pool.query(query);
    res.json({ message: "Insert cart success" }).status(200);
  } catch (error) {
    res.json({ message: "Authentication fail" }).status(403);
  }
});

app.post("/get_cart", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    let authToken;
    if (authHeader) {
      authToken = authHeader.split(" ")[1];
    }
    const user = jwt.verify(authToken, secret);
    const query = {
      text: `SELECT 
              cart.*, 
              products.*
            FROM 
              cart
            JOIN 
              products ON cart.product_id = products.product_id
            WHERE 
              cart.user_id = $1;
            `,
      values: [user.userId],
    };
    const result = await pool.query(query);
    result.rows.forEach((item) => {
      item.addons = JSON.parse(item.addons);
    });
    res.json(result.rows).status(200);
  } catch (error) {
    res.json({ message: "Authentication fail" }).status(403);
  }
});

app.put("/update_cart", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    let authToken;
    if (authHeader) {
      authToken = authHeader.split(" ")[1];
    }
    const user = jwt.verify(authToken, secret);
    const { product_id, quantity } = req.body;
    const query = {
      text: `UPDATE cart SET quantity = $1 WHERE user_id = $2 AND product_id = $3`,
      values: [quantity, user.userId, product_id],
    };
    await pool.query(query);
    res.json({ message: "Update cart success" }).status(200);
  } catch (error) {
    res.json({ message: "Update cart fail" }).status(403);
  }
});

app.delete("/delete_cart", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    let authToken;
    if (authHeader) {
      authToken = authHeader.split(" ")[1];
    }
    const user = jwt.verify(authToken, secret);
    const { product_id } = req.body;
    const query = {
      text: `DELETE FROM cart WHERE user_id = $1 AND product_id = $2`,
      values: [user.userId, product_id],
    };
    await pool.query(query);
    res.json({ message: "Delete cart success" }).status(200);
  } catch (error) {
    res.json({ message: "Delete cart fail" }).status(403);
  }
});

app.post("/insert_order", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    let authToken;
    if (authHeader) {
      authToken = authHeader.split(" ")[1];
    }
    const user = jwt.verify(authToken, secret);
    const { total } = req.body;
    const { rows } = await pool.query(
      `SELECT address FROM user_info WHERE user_id = $1`,
      [user.userId]
    );

    const address = rows[0].address;
    let query = {
      text: `INSERT INTO orders (user_id, status, total_amount, delivery_to, create_at, review, rating) VALUES ($1, $2, $3, $4, NOW(),false, 1)`,
      values: [user.userId, "กำลังตรวจสอบคำสั่งซื้อ", total, address],
    };
    await pool.query(query);
    query = {
      text: `INSERT INTO order_item (order_id, product_id, quantity, detail , addons, "addonsPrice") SELECT (SELECT MAX(order_id) FROM orders WHERE user_id = $1), product_id, quantity, detail, addons, "addonsPrice" FROM cart WHERE user_id = $1`,
      values: [user.userId],
    };
    await pool.query(query);
    query = {
      text: `DELETE FROM cart WHERE user_id = $1`,
      values: [user.userId],
    };
    await pool.query(query);
    res
      .json({
        message: "Insert order success",
      })
      .status(200);
  } catch (error) {
    console.log(error);
    res.json({ message: "Insert order fail" }).status(403);
  }
});

app.post("/get_order", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    let authToken;
    if (authHeader) {
      authToken = authHeader.split(" ")[1];
    }

    const user = jwt.verify(authToken, secret);
    const query = {
      text: `SELECT 
                orders.order_id, 
                orders.status, 
                CAST(orders.total_amount AS NUMERIC) AS total_amount, 
                orders.delivery_to, 
                TO_CHAR(orders.create_at, 'DD/MM/YYYY HH:MI AM') AS create_at,
                orders.review,
                orders."reviewText",
                orders.rating,
                CONCAT(user_info.name, ' ', user_info.lastname) AS "customerName",
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'product_name', products.name, 
                        'price', products.price, 
                        'detail', order_item.detail, 
                        'quantity', order_item.quantity,
                        'addons', order_item.addons,
                        'addonsPrice', order_item."addonsPrice"
                    )
                ) AS "menuItems"
            FROM 
                orders
            JOIN order_item ON orders.order_id = order_item.order_id
            JOIN products ON order_item.product_id = products.product_id
            JOIN user_info ON orders.user_id = user_info.user_id
            WHERE 
                orders.user_id = $1
            GROUP BY 
                orders.order_id, 
                orders.status, 
                orders.total_amount, 
                orders.delivery_to, 
                orders.create_at, 
                orders.review, 
                orders.rating,
                orders."reviewText",
                user_info.name, 
                user_info.lastname;
            `,
      values: [user.userId],
    };
    const result = await pool.query(query);

    result.rows.forEach((item) => {
      item.menuItems.forEach((menuItem) => {
        menuItem.addons = JSON.parse(menuItem.addons);
      });
    });

    res.json(result.rows).status(200);
  } catch (error) {
    console.log(error);
    res.json({ message: "Authentication fail" }).status(403);
  }
});

app.post("/update_order_status", async (req, res) => {
  try {
    const { order_id, status } = req.body;
    const query = {
      text: `UPDATE orders SET status = $1 WHERE order_id = $2`,
      values: [status, order_id],
    };
    await pool.query(query);
    res.json({ message: "Update order status success" }).status(200);
  } catch (error) {
    res.json({ message: "Update order status fail" }).status(403);
  }
});

app.post("/get_status", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    let authToken;
    if (authHeader) {
      authToken = authHeader.split(" ")[1];
    }
    const user = jwt.verify(authToken, secret);

    const query = {
      text: `SELECT order_id, status FROM orders WHERE user_id = $1`,
      values: [user.userId],
    };

    const result = await pool.query(query);
    result.rows.forEach((item) => {
      item.currentStep = 0;
    })
    res.json(result.rows).status(200);
  } catch (error) {
    res.json({ message: "Get status fail" }).status(403);
  }
});

app.post("/get_order_id", async (req, res) => {
  try {
    const { order_id } = req.body;
    const query = {
      text: `SELECT 
                orders.order_id, 
                orders.status, 
                CAST(orders.total_amount AS NUMERIC) AS total_amount, 
                orders.delivery_to, 
                TO_CHAR(orders.create_at, 'DD/MM/YYYY HH:MI AM') AS create_at,
                orders.review,
                orders."reviewText",
                orders.rating,
                CONCAT(user_info.name, ' ', user_info.lastname) AS "customerName",
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'product_name', products.name, 
                        'price', products.price, 
                        'detail', order_item.detail, 
                        'quantity', order_item.quantity,
                        'addons', order_item.addons,
                        'addonsPrice', order_item."addonsPrice"
                    )
                ) AS "menuItems"
            FROM 
                orders
            JOIN order_item ON orders.order_id = order_item.order_id
            JOIN products ON order_item.product_id = products.product_id
            JOIN user_info ON orders.user_id = user_info.user_id
            WHERE
                orders.order_id = $1
            GROUP BY 
                orders.order_id, 
                orders.status, 
                orders.total_amount, 
                orders.delivery_to, 
                orders.create_at, 
                orders.review, 
                orders.rating,
                orders."reviewText",
                user_info.name, 
                user_info.lastname;
            `,
      values: [order_id],
    };
    const result = await pool.query(query);

    result.rows.forEach((item) => {
      item.menuItems.forEach((menuItem) => {
        menuItem.addons = JSON.parse(menuItem.addons);
      });
    })
    res.json(result.rows).status(200);
  } catch (error) {
    res.json({ message: "Authentication fail" }).status(403);
  }
});

app.post("/get_all_order", async (req, res) => {
  try {
    const query = {
      text: `SELECT 
                orders.order_id, 
                orders.status, 
                CAST(orders.total_amount AS NUMERIC) AS total_amount, 
                orders.delivery_to, 
                TO_CHAR(orders.create_at, 'DD/MM/YYYY HH:MI AM') AS create_at,
                orders.review,
                orders."reviewText",
                orders.rating,
                CONCAT(user_info.name, ' ', user_info.lastname) AS "customerName",
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'product_name', products.name, 
                        'price', products.price, 
                        'detail', order_item.detail, 
                        'quantity', order_item.quantity,
                        'addons', order_item.addons,
                        'addonsPrice', order_item."addonsPrice"
                    )
                ) AS "menuItems"
            FROM 
                orders
            JOIN order_item ON orders.order_id = order_item.order_id
            JOIN products ON order_item.product_id = products.product_id
            JOIN user_info ON orders.user_id = user_info.user_id
            GROUP BY 
                orders.order_id, 
                orders.status, 
                orders.total_amount, 
                orders.delivery_to, 
                orders.create_at, 
                orders.review, 
                orders.rating,
                orders."reviewText",
                user_info.name, 
                user_info.lastname;
            `,
    };
    const result = await pool.query(query);
    result.rows.forEach((item) => {
      item.menuItems.forEach((menuItem) => {
        menuItem.addons = JSON.parse(menuItem.addons);
      });
    });
    res.json(result.rows).status(200);
  } catch (error) {
    res.json({ message: "Authentication fail" }).status(403);
  }
});

app.post("/update_order_status", async (req, res) => {
  try {
    const { order_id, status } = req.body;
    const query = {
      text: `UPDATE orders SET status = $1 WHERE order_id = $2`,
      values: [status, order_id],
    };
    await pool.query(query);
    res.json({ message: "Update order status success" }).status(200);
  } catch (error) {
    res.json({ message: "Update order status fail" }).status(403);
  }
});

app.put("/update_review", async (req, res) => {
  try {
    const { order_id, reviewText, rating } = req.body;
    const query = {
      text: `UPDATE orders SET review = true, "reviewText" = $1, rating = $2 WHERE order_id = $3`,
      values: [reviewText, rating, order_id],
    };
    await pool.query(query);
    res.json({ message: "Update review success" }).status(200);
  } catch (error) {
    res.json({ message: "Update review fail" }).status(403);
  }
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
