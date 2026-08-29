const DEMO_TOKEN = "bgs-demo-token";

const DEMO_PRODUCTS = [
  {
    id: 1,
    name: "Trebon",
    category: "Insecticides",
    categorySinhala: "????????",
    size: "400ml",
    invoice: "INV-2026-001",
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
    categorySinhala: "????????",
    size: "100ml",
    invoice: "INV-2026-002",
    expiry: "2027-06-20",
    received: 30,
    balance: 7,
    minimum: 10,
    unitPrice: 1250,
  },
  {
    id: 3,
    name: "Corajan",
    category: "Insecticides",
    categorySinhala: "????????",
    size: "5ml",
    invoice: "INV-2026-003",
    expiry: "2026-10-05",
    received: 20,
    balance: 3,
    minimum: 8,
    unitPrice: 1500,
  },
  {
    id: 4,
    name: "Marshal 20",
    category: "Insecticides",
    categorySinhala: "????????",
    size: "200ml",
    invoice: "INV-2026-004",
    expiry: "2027-12-18",
    received: 40,
    balance: 25,
    minimum: 10,
    unitPrice: 1500,
  },
  {
    id: 5,
    name: "Fipronil GR",
    category: "Insecticides",
    categorySinhala: "????????",
    size: "500g",
    invoice: "INV-2026-005",
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
    categorySinhala: "???????",
    size: "1L",
    invoice: "INV-2026-006",
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
    categorySinhala: "???????",
    size: "4L",
    invoice: "INV-2026-007",
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
    categorySinhala: "???????",
    size: "2L",
    invoice: "INV-2026-008",
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
    categorySinhala: "?????????",
    size: "500g",
    invoice: "INV-2026-009",
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
    categorySinhala: "?????????",
    size: "100g",
    invoice: "INV-2026-010",
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
    categorySinhala: "?????????",
    size: "500g",
    invoice: "INV-2026-011",
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
    categorySinhala: "???????",
    size: "100g",
    invoice: "INV-2026-012",
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
    type: "sale",
    product_id: 1,
    product_name: "Trebon",
    size: "400ml",
    quantity: 4,
    balance: 24,
    message: "4 units of Trebon sold",
    created_at: "2026-08-30T09:15:00",
  },
  {
    id: 2,
    type: "restock",
    product_id: 7,
    product_name: "Glyphosate",
    size: "4L",
    quantity: 10,
    balance: 14,
    message: "10 units of Glyphosate restocked",
    created_at: "2026-08-29T14:30:00",
  },
  {
    id: 3,
    type: "sale",
    product_id: 4,
    product_name: "Marshal 20",
    size: "200ml",
    quantity: 3,
    balance: 25,
    message: "3 units of Marshal 20 sold",
    created_at: "2026-08-29T10:20:00",
  },
  {
    id: 4,
    type: "restock",
    product_id: 9,
    product_name: "Mancozeb",
    size: "500g",
    quantity: 15,
    balance: 17,
    message: "15 units of Mancozeb restocked",
    created_at: "2026-08-28T16:10:00",
  },
];

const DEMO_STORAGE_KEY = "bgs_demo_inventory";
const DEMO_ACTIVITY_KEY = "bgs_demo_activities";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadProducts() {
  const stored = localStorage.getItem(DEMO_STORAGE_KEY);

  if (!stored) {
    const products = clone(DEMO_PRODUCTS);
    localStorage.setItem(
      DEMO_STORAGE_KEY,
      JSON.stringify(products)
    );
    return products;
  }

  try {
    return JSON.parse(stored);
  } catch {
    localStorage.setItem(
      DEMO_STORAGE_KEY,
      JSON.stringify(DEMO_PRODUCTS)
    );
    return clone(DEMO_PRODUCTS);
  }
}

function loadActivities() {
  const stored = localStorage.getItem(DEMO_ACTIVITY_KEY);

  if (!stored) {
    const activities = clone(DEMO_ACTIVITIES);
    localStorage.setItem(
      DEMO_ACTIVITY_KEY,
      JSON.stringify(activities)
    );
    return activities;
  }

  try {
    return JSON.parse(stored);
  } catch {
    localStorage.setItem(
      DEMO_ACTIVITY_KEY,
      JSON.stringify(DEMO_ACTIVITIES)
    );
    return clone(DEMO_ACTIVITIES);
  }
}

function saveProducts(products) {
  localStorage.setItem(
    DEMO_STORAGE_KEY,
    JSON.stringify(products)
  );
}

function saveActivities(activities) {
  localStorage.setItem(
    DEMO_ACTIVITY_KEY,
    JSON.stringify(activities.slice(0, 100))
  );
}

function nextId(items) {
  return (
    Math.max(
      0,
      ...items.map((item) => Number(item.id) || 0)
    ) + 1
  );
}

export async function loginUser(email, password) {
  await new Promise((resolve) => setTimeout(resolve, 500));

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
    token: DEMO_TOKEN,
    user: {
      id: 1,
      name: "Demo Administrator",
      email: "demo@bgsagristock.com",
      role: "admin",
    },
  };
}

export async function getProducts() {
  await new Promise((resolve) => setTimeout(resolve, 200));

  return {
    success: true,
    products: loadProducts(),
  };
}

export async function getActivities() {
  await new Promise((resolve) => setTimeout(resolve, 200));

  return {
    success: true,
    activities: loadActivities(),
  };
}

export async function createProduct(productData) {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const products = loadProducts();

  const product = {
    id: nextId(products),
    name: productData.name,
    category: productData.category,
    categorySinhala:
      productData.categorySinhala || "",
    size: productData.size,
    invoice: productData.invoice || "",
    expiry: productData.expiry || null,
    received: Number(productData.received || 0),
    balance: Number(productData.received || 0),
    minimum: Number(productData.minimum || 5),
    unitPrice: Number(productData.unitPrice || 0),
  };

  products.unshift(product);
  saveProducts(products);

  const activities = loadActivities();

  activities.unshift({
    id: nextId(activities),
    type: "restock",
    product_id: product.id,
    product_name: product.name,
    size: product.size,
    quantity: product.received,
    balance: product.balance,
    message: `${product.received} units of ${product.name} added`,
    created_at: new Date().toISOString(),
  });

  saveActivities(activities);

  return {
    success: true,
    product,
  };
}

export async function sellProduct(
  productId,
  soldQuantity
) {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const products = loadProducts();
  const quantity = Number(soldQuantity);

  const product = products.find(
    (item) => String(item.id) === String(productId)
  );

  if (!product) {
    throw new Error("Product not found.");
  }

  if (!quantity || quantity <= 0) {
    throw new Error("Enter a valid quantity.");
  }

  if (quantity > Number(product.balance)) {
    throw new Error(
      `Only ${product.balance} units are available.`
    );
  }

  product.balance =
    Number(product.balance) - quantity;

  saveProducts(products);

  const activities = loadActivities();

  const activity = {
    id: nextId(activities),
    type: "sale",
    product_id: product.id,
    product_name: product.name,
    size: product.size,
    quantity,
    balance: product.balance,
    message: `${quantity} units of ${product.name} sold`,
    created_at: new Date().toISOString(),
  };

  activities.unshift(activity);
  saveActivities(activities);

  return {
    success: true,
    newBalance: product.balance,
    activity,
  };
}

export async function restockProduct(
  productId,
  restockData
) {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const products = loadProducts();

  const product = products.find(
    (item) => String(item.id) === String(productId)
  );

  if (!product) {
    throw new Error("Product not found.");
  }

  const quantity = Number(
    restockData.restockQuantity
  );

  if (!quantity || quantity <= 0) {
    throw new Error("Enter a valid restock quantity.");
  }

  product.received =
    Number(product.received) + quantity;

  product.balance =
    Number(product.balance) + quantity;

  if (restockData.invoiceNumber) {
    product.invoice = restockData.invoiceNumber;
  }

  if (restockData.expiryDate) {
    product.expiry = restockData.expiryDate;
  }

  if (
    restockData.unitPrice !== undefined &&
    restockData.unitPrice !== ""
  ) {
    product.unitPrice = Number(
      restockData.unitPrice
    );
  }

  saveProducts(products);

  const activities = loadActivities();

  const activity = {
    id: nextId(activities),
    type: "restock",
    product_id: product.id,
    product_name: product.name,
    size: product.size,
    quantity,
    balance: product.balance,
    message: `${quantity} units of ${product.name} restocked`,
    created_at: new Date().toISOString(),
  };

  activities.unshift(activity);
  saveActivities(activities);

  return {
    success: true,
    product,
    activity,
  };
}

export function resetDemoData() {
  localStorage.removeItem(DEMO_STORAGE_KEY);
  localStorage.removeItem(DEMO_ACTIVITY_KEY);
}
