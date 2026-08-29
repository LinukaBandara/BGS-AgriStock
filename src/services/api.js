const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const DEMO_MODE =
  import.meta.env.VITE_DEMO_MODE === "true";

/* =========================================================
   DEMO DATA
========================================================= */

const DEMO_USER = {
  id: 1,
  name: "BGS Administrator",
  email: "demo@bgsagristock.com",
  role: "admin",
};

const DEMO_PRODUCTS = [
  {
    id: 1,
    name: "Trebon",
    category: "Insecticides",
    categorySinhala: "???? ????",
    size: "400ml",
    invoice: "DEMO-INV-001",
    expiry: "2027-08-15",
    received: 40,
    balance: 24,
    minimum: 10,
    unitPrice: 1750,
  },
  {
    id: 2,
    name: "Trebon",
    category: "Insecticides",
    categorySinhala: "???? ????",
    size: "100ml",
    invoice: "DEMO-INV-002",
    expiry: "2027-06-20",
    received: 30,
    balance: 7,
    minimum: 10,
    unitPrice: 1250,
  },
  {
    id: 3,
    name: "Marshal 20",
    category: "Insecticides",
    categorySinhala: "???? ????",
    size: "200ml",
    invoice: "DEMO-INV-003",
    expiry: "2027-12-18",
    received: 40,
    balance: 25,
    minimum: 10,
    unitPrice: 1500,
  },
  {
    id: 4,
    name: "Corajan",
    category: "Insecticides",
    categorySinhala: "???? ????",
    size: "5ml",
    invoice: "DEMO-INV-004",
    expiry: "2026-10-05",
    received: 20,
    balance: 3,
    minimum: 8,
    unitPrice: 1500,
  },
  {
    id: 5,
    name: "Fipronil GR",
    category: "Insecticides",
    categorySinhala: "???? ????",
    size: "500g",
    invoice: "DEMO-INV-005",
    expiry: "2027-04-28",
    received: 25,
    balance: 19,
    minimum: 8,
    unitPrice: 1500,
  },
  {
    id: 6,
    name: "Glyphosate",
    category: "Herbicides",
    categorySinhala: "??? ????",
    size: "1L",
    invoice: "DEMO-INV-006",
    expiry: "2027-09-30",
    received: 30,
    balance: 9,
    minimum: 10,
    unitPrice: 2000,
  },
  {
    id: 7,
    name: "Glyphosate",
    category: "Herbicides",
    categorySinhala: "??? ????",
    size: "4L",
    invoice: "DEMO-INV-007",
    expiry: "2028-01-12",
    received: 20,
    balance: 14,
    minimum: 6,
    unitPrice: 4000,
  },
  {
    id: 8,
    name: "Glufosinate A",
    category: "Herbicides",
    categorySinhala: "??? ????",
    size: "2L",
    invoice: "DEMO-INV-008",
    expiry: "2027-11-24",
    received: 24,
    balance: 17,
    minimum: 8,
    unitPrice: 2500,
  },
  {
    id: 9,
    name: "Mancozeb",
    category: "Fungicides",
    categorySinhala: "????? ????",
    size: "500g",
    invoice: "DEMO-INV-009",
    expiry: "2026-09-10",
    received: 25,
    balance: 17,
    minimum: 8,
    unitPrice: 1500,
  },
  {
    id: 10,
    name: "Carbendazim",
    category: "Fungicides",
    categorySinhala: "????? ????",
    size: "100g",
    invoice: "DEMO-INV-010",
    expiry: "2027-03-14",
    received: 30,
    balance: 24,
    minimum: 8,
    unitPrice: 800,
  },
  {
    id: 11,
    name: "Sulfur",
    category: "Fungicides",
    categorySinhala: "????? ????",
    size: "500g",
    invoice: "DEMO-INV-011",
    expiry: "2027-07-22",
    received: 35,
    balance: 22,
    minimum: 10,
    unitPrice: 1000,
  },
  {
    id: 12,
    name: "Paara",
    category: "Herbicides",
    categorySinhala: "??? ????",
    size: "100g",
    invoice: "DEMO-INV-012",
    expiry: "2026-08-08",
    received: 15,
    balance: 5,
    minimum: 8,
    unitPrice: 1500,
  },
];

const DEMO_ACTIVITIES = [
  {
    id: 1,
    type: "restock",
    product_id: 1,
    product_name: "Trebon",
    size: "400ml",
    quantity: 40,
    balance: 24,
    message: "Trebon 400ml stock received",
    created_at: "2026-08-30T08:30:00.000Z",
  },
  {
    id: 2,
    type: "sale",
    product_id: 2,
    product_name: "Trebon",
    size: "100ml",
    quantity: 3,
    balance: 7,
    message: "Trebon 100ml sale recorded",
    created_at: "2026-08-30T07:45:00.000Z",
  },
  {
    id: 3,
    type: "sale",
    product_id: 6,
    product_name: "Glyphosate",
    size: "1L",
    quantity: 5,
    balance: 9,
    message: "Glyphosate 1L sale recorded",
    created_at: "2026-08-29T15:20:00.000Z",
  },
  {
    id: 4,
    type: "restock",
    product_id: 9,
    product_name: "Mancozeb",
    size: "500g",
    quantity: 25,
    balance: 17,
    message: "Mancozeb 500g stock received",
    created_at: "2026-08-29T11:10:00.000Z",
  },
];

/* =========================================================
   DEMO STORAGE
========================================================= */

const DEMO_PRODUCTS_KEY = "bgs_demo_products";
const DEMO_ACTIVITIES_KEY = "bgs_demo_activities";

function readDemoData(key, fallback) {
  try {
    const stored = localStorage.getItem(key);

    if (!stored) {
      return fallback;
    }

    const parsed = JSON.parse(stored);

    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function writeDemoData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function getDemoProducts() {
  return readDemoData(
    DEMO_PRODUCTS_KEY,
    DEMO_PRODUCTS
  );
}

function getDemoActivities() {
  return readDemoData(
    DEMO_ACTIVITIES_KEY,
    DEMO_ACTIVITIES
  );
}

function createDemoToken() {
  const header = btoa(
    JSON.stringify({
      alg: "HS256",
      typ: "JWT",
    })
  );

  const payload = btoa(
    JSON.stringify({
      sub: "demo-admin",
      email: DEMO_USER.email,
      role: "admin",
      demo: true,
      exp:
        Math.floor(Date.now() / 1000) +
        60 * 60 * 24,
    })
  );

  return `${header}.${payload}.demo`;
}

/* =========================================================
   TOKEN HELPERS
========================================================= */

function getStoredToken() {
  return (
    localStorage.getItem("bgs_token") ||
    sessionStorage.getItem("bgs_token")
  );
}

function clearStoredSession() {
  localStorage.removeItem("bgs_token");
  localStorage.removeItem("bgs_user");

  sessionStorage.removeItem("bgs_token");
  sessionStorage.removeItem("bgs_user");
}

function getAuthHeaders(includeContentType = false) {
  const token = getStoredToken();
  const headers = {};

  if (includeContentType) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

/* =========================================================
   RESPONSE HANDLING
========================================================= */

async function handleResponse(response) {
  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error(
      "The server returned an invalid response."
    );
  }

  if (response.status === 401) {
    clearStoredSession();

    throw new Error(
      data.message ||
        "Your session has expired. Please sign in again."
    );
  }

  if (!response.ok) {
    throw new Error(
      data.message || "Something went wrong."
    );
  }

  return data;
}

/* =========================================================
   AUTHENTICATION
========================================================= */

export async function loginUser(email, password) {
  if (DEMO_MODE) {
    await new Promise((resolve) =>
      setTimeout(resolve, 500)
    );

    if (
      email.trim().toLowerCase() !==
        "demo@bgsagristock.com" ||
      password !== "demo123"
    ) {
      throw new Error(
        "Invalid demo credentials. Use demo@bgsagristock.com / demo123"
      );
    }

    return {
      success: true,
      token: createDemoToken(),
      user: DEMO_USER,
      demo: true,
    };
  }

  const response = await fetch(
    `${API_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  return handleResponse(response);
}

/* =========================================================
   PRODUCTS
========================================================= */

export async function getProducts() {
  if (DEMO_MODE) {
    return {
      success: true,
      products: getDemoProducts(),
      demo: true,
    };
  }

  const response = await fetch(
    `${API_URL}/products`,
    {
      headers: getAuthHeaders(),
    }
  );

  return handleResponse(response);
}

export async function createProduct(productData) {
  if (DEMO_MODE) {
    const products = getDemoProducts();

    const product = {
      id:
        Date.now(),
      name: productData.name,
      category: productData.category,
      categorySinhala:
        productData.categorySinhala || "",
      size: productData.size,
      invoice:
        productData.invoice || "DEMO-NEW",
      expiry:
        productData.expiry || null,
      received:
        Number(productData.received || 0),
      balance:
        Number(
          productData.balance ??
            productData.received ??
            0
        ),
      minimum:
        Number(
          productData.minimum ??
            productData.minimumStock ??
            5
        ),
      unitPrice:
        Number(productData.unitPrice || 0),
    };

    writeDemoData(
      DEMO_PRODUCTS_KEY,
      [product, ...products]
    );

    return {
      success: true,
      product,
      demo: true,
    };
  }

  const response = await fetch(
    `${API_URL}/products`,
    {
      method: "POST",
      headers: getAuthHeaders(true),
      body: JSON.stringify(productData),
    }
  );

  return handleResponse(response);
}

export async function sellProduct(
  productId,
  soldQuantity
) {
  if (DEMO_MODE) {
    const products = getDemoProducts();

    const index = products.findIndex(
      (item) =>
        String(item.id) ===
        String(productId)
    );

    if (index === -1) {
      throw new Error("Product not found.");
    }

    const product = products[index];
    const quantity = Number(soldQuantity);

    if (
      !Number.isFinite(quantity) ||
      quantity <= 0
    ) {
      throw new Error(
        "Enter a valid sale quantity."
      );
    }

    if (quantity > Number(product.balance)) {
      throw new Error(
        "Sale quantity cannot exceed available stock."
      );
    }

    const newBalance =
      Number(product.balance) - quantity;

    products[index] = {
      ...product,
      balance: newBalance,
    };

    writeDemoData(
      DEMO_PRODUCTS_KEY,
      products
    );

    const activity = {
      id: Date.now(),
      type: "sale",
      product_id: product.id,
      product_name: product.name,
      size: product.size,
      quantity,
      balance: newBalance,
      message: `${product.name} ${product.size} sale recorded`,
      created_at:
        new Date().toISOString(),
    };

    const activities = getDemoActivities();

    writeDemoData(
      DEMO_ACTIVITIES_KEY,
      [activity, ...activities].slice(0, 100)
    );

    return {
      success: true,
      newBalance,
      activity,
      demo: true,
    };
  }

  const response = await fetch(
    `${API_URL}/products/${productId}/sell`,
    {
      method: "PATCH",
      headers: getAuthHeaders(true),
      body: JSON.stringify({
        soldQuantity,
      }),
    }
  );

  return handleResponse(response);
}

export async function restockProduct(
  productId,
  restockData
) {
  if (DEMO_MODE) {
    const products = getDemoProducts();

    const index = products.findIndex(
      (item) =>
        String(item.id) ===
        String(productId)
    );

    if (index === -1) {
      throw new Error("Product not found.");
    }

    const product = products[index];
    const quantity = Number(
      restockData.restockQuantity
    );

    if (
      !Number.isFinite(quantity) ||
      quantity <= 0
    ) {
      throw new Error(
        "Enter a valid restock quantity."
      );
    }

    const updatedProduct = {
      ...product,
      received:
        Number(product.received || 0) +
        quantity,
      balance:
        Number(product.balance || 0) +
        quantity,
      invoice:
        restockData.invoiceNumber ||
        product.invoice,
      expiry:
        restockData.expiryDate ||
        product.expiry,
      unitPrice:
        Number(
          restockData.unitPrice ??
            product.unitPrice ??
            0
        ),
    };

    products[index] = updatedProduct;

    writeDemoData(
      DEMO_PRODUCTS_KEY,
      products
    );

    const activity = {
      id: Date.now(),
      type: "restock",
      product_id: product.id,
      product_name: product.name,
      size: product.size,
      quantity,
      balance:
        updatedProduct.balance,
      message: `${product.name} ${product.size} restocked`,
      created_at:
        new Date().toISOString(),
    };

    const activities = getDemoActivities();

    writeDemoData(
      DEMO_ACTIVITIES_KEY,
      [activity, ...activities].slice(0, 100)
    );

    return {
      success: true,
      product: updatedProduct,
      activity,
      demo: true,
    };
  }

  const response = await fetch(
    `${API_URL}/products/${productId}/restock`,
    {
      method: "PATCH",
      headers: getAuthHeaders(true),
      body: JSON.stringify(restockData),
    }
  );

  return handleResponse(response);
}

/* =========================================================
   ACTIVITIES
========================================================= */

export async function getActivities() {
  if (DEMO_MODE) {
    return {
      success: true,
      activities: getDemoActivities(),
      demo: true,
    };
  }

  const response = await fetch(
    `${API_URL}/activities`,
    {
      headers: getAuthHeaders(),
    }
  );

  return handleResponse(response);
}
