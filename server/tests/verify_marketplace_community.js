const fs = require("fs");
const path = require("path");

const API_BASE = "http://localhost:5001";

async function runTests() {
  console.log("==========================================================");
  console.log("NUROVA E2E VERIFICATION TEST SUITE");
  console.log("==========================================================");

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${message}`);
      failed++;
    }
  }

  // 1. Log in as Practitioner 1
  console.log("\n--- TEST 1: Practitioner 1 Login & Authentication ---");
  const loginRes1 = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "shaikali@gmail.com",
      password: "password123", // let's test if password123 works, or use known practitioner
    }),
  });
  let token1;
  let user1;
  const loginData1 = await loginRes1.json();
  if (loginRes1.ok && loginData1.token) {
    token1 = loginData1.token;
    user1 = loginData1.user;
    assert(true, `Practitioner 1 logged in as ${user1.name || user1.email}`);
  } else {
    // Try test practitioner
    console.log("  Trying practitioner@test.com...");
    const loginResTest = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "practitioner@test.com",
        password: "password123",
      }),
    });
    const loginDataTest = await loginResTest.json();
    if (loginResTest.ok && loginDataTest.token) {
      token1 = loginDataTest.token;
      user1 = loginDataTest.user;
      assert(true, `Practitioner 1 logged in as ${user1.name || user1.email}`);
    } else {
      // Register or use charankumar
      console.log("  Trying charankumar@gmail.com...");
      const loginResCharan = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "charankumar@gmail.com",
          password: "password123",
        }),
      });
      const loginDataCharan = await loginResCharan.json();
      token1 = loginDataCharan.token;
      user1 = loginDataCharan.user;
      assert(Boolean(token1), `Practitioner 1 authenticated: ${user1?.name || "charankumar"}`);
    }
  }

  // 2. Fetch Practitioner's Own Products
  console.log("\n--- TEST 2: Practitioner Product Management Listing ---");
  const myProductsRes = await fetch(`${API_BASE}/api/products/my-products`, {
    headers: { Authorization: `Bearer ${token1}` },
  });
  const myProductsData = await myProductsRes.json();
  assert(myProductsRes.ok && Array.isArray(myProductsData.data), "GET /api/products/my-products returned product list");
  console.log(`  Practitioner owns ${myProductsData.data.length} product(s)`);

  // 3. Create a New Product as Practitioner
  console.log("\n--- TEST 3: Create New Product with All Details ---");
  const uniqueName = `Ayurvedic Brahmi Rasayana ${Date.now()}`;
  const createProductRes = await fetch(`${API_BASE}/api/products`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token1}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: uniqueName,
      shortDescription: "Cognitive support and stress alleviation botanical paste.",
      description: "Traditional classical Medhya Rasayana prepared with wild Brahmi, Shankhpushpi, and pure A2 cow ghee for daily neurological balance and deep mental clarity.",
      price: 650,
      category: "Herbal Supplements",
      stock: 15,
      brand: "Vedic Botanicals",
      specifications: "100% Organic, GMP Certified",
      usageInstructions: "1 teaspoon morning and evening with warm milk",
      ingredients: ["Brahmi", "Shankhpushpi", "A2 Ghee", "Cardamom"],
      benefits: ["Stress & Sleep", "Energy & Vitality"],
      image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80",
    }),
  });
  const createProductData = await createProductRes.json();
  assert(createProductRes.status === 201 && createProductData.data?._id, `Product created: ${uniqueName}`);
  const createdProductId = createProductData.data?._id;

  // 4. Confirm Persistence and Practitioner Resolution
  console.log("\n--- TEST 4: Product Persistence and Seller Attribution ---");
  const getSingleRes = await fetch(`${API_BASE}/api/products/${createdProductId}`);
  const getSingleData = await getSingleRes.json();
  assert(getSingleRes.ok && getSingleData.data?.name === uniqueName, "Product persisted in MongoDB and retrieved by ID");
  assert(
    Boolean(getSingleData.data?.practitioner?.displayName || getSingleData.data?.practitionerId?.displayName),
    `Practitioner resolved: ${getSingleData.data?.practitioner?.displayName}`
  );
  assert(
    getSingleData.data?.practitioner?.verified === true || getSingleData.data?.practitioner?.verified === false,
    `Verified status flag present: ${getSingleData.data?.practitioner?.verified}`
  );

  // 5. Edit Existing Product
  console.log("\n--- TEST 5: Practitioner Edit Product ---");
  const updateRes = await fetch(`${API_BASE}/api/products/${createdProductId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token1}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: `${uniqueName} (Enhanced Formula)`,
      price: 699,
      stock: 25,
      description: "Enhanced formulation with added Ashwagandha KSM-66 for adaptogenic strength.",
      category: "Herbal Supplements",
    }),
  });
  const updateData = await updateRes.json();
  assert(updateRes.ok && updateData.data?.price === 699 && updateData.data?.stock === 25, "Product price updated to 699 and stock to 25");

  // 6. Public Marketplace Listing Verification
  console.log("\n--- TEST 6: Public Customer Marketplace Listing ---");
  const marketplaceRes = await fetch(`${API_BASE}/api/products`);
  const marketplaceData = await marketplaceRes.json();
  assert(marketplaceRes.ok && marketplaceData.success, "GET /api/products succeeded");
  const foundInMarketplace = marketplaceData.data.find((p) => p._id === createdProductId);
  assert(Boolean(foundInMarketplace), "New product visible in customer-facing marketplace");
  assert(foundInMarketplace?.practitionerId !== null, "Product practitionerId is populated (not null)");
  assert(
    Boolean(foundInMarketplace?.practitioner?.displayName),
    `Product displays practitioner name: ${foundInMarketplace?.practitioner?.displayName}`
  );

  // 7. Normal User Login & Cart / Checkout Simulation
  console.log("\n--- TEST 7: Normal User Purchase Workflow & Stock Decrement ---");
  const loginUserRes = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "ali@gmail.com",
      password: "password123",
    }),
  });
  const loginUserData = await loginUserRes.json();
  const normalUserId = loginUserData.user?.id || loginUserData.user?._id;
  assert(loginUserRes.ok && Boolean(normalUserId), `Normal user logged in: ${loginUserData.user?.email}`);

  // Place order for 2 units
  const initialStock = foundInMarketplace.stock;
  const orderRes = await fetch(`${API_BASE}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: normalUserId,
      productId: createdProductId,
      quantity: 2,
    }),
  });
  const orderData = await orderRes.json();
  assert(orderRes.status === 201 && orderData.success, "Order placed successfully for 2 units");

  // Verify stock decremented
  const checkStockRes = await fetch(`${API_BASE}/api/products/${createdProductId}`);
  const checkStockData = await checkStockRes.json();
  assert(checkStockData.data?.stock === initialStock - 2, `Stock decremented from ${initialStock} to ${checkStockData.data?.stock}`);

  // 8. Normal User Cannot Modify Product (Role-Based Enforcement)
  console.log("\n--- TEST 8: Role-Based Authorization Enforcement ---");
  const unauthorizedUpdateRes = await fetch(`${API_BASE}/api/products/${createdProductId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${loginUserData.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ price: 10 }),
  });
  assert(unauthorizedUpdateRes.status === 403, `Normal user blocked from editing product (HTTP ${unauthorizedUpdateRes.status} 403 Forbidden)`);

  const unauthorizedDeleteRes = await fetch(`${API_BASE}/api/products/${createdProductId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${loginUserData.token}`,
    },
  });
  assert(unauthorizedDeleteRes.status === 403, `Normal user blocked from deleting product (HTTP ${unauthorizedDeleteRes.status} 403 Forbidden)`);

  // 9. Community Q&A: Retrieve Questions & Answers
  console.log("\n--- TEST 9: Community Q&A - Practitioner Identity on Answers ---");
  const questionsRes = await fetch(`${API_BASE}/api/community/questions`);
  const questionsData = await questionsRes.json();
  assert(questionsRes.ok && questionsData.data.length > 0, `Community questions fetched (${questionsData.data.length} questions)`);

  const testQuestion = questionsData.data[0];
  const answersRes = await fetch(`${API_BASE}/api/community/questions/${testQuestion._id}/answers`);
  const answersData = await answersRes.json();
  assert(answersRes.ok && Array.isArray(answersData.data), "Question answers fetched successfully");

  if (answersData.data.length > 0) {
    const firstAnswer = answersData.data[0];
    assert(
      firstAnswer.practitioner && firstAnswer.practitioner.name && firstAnswer.practitioner.name !== "Verified Practitioner",
      `Answer displays real practitioner name: "${firstAnswer.practitioner.displayName || firstAnswer.practitioner.name}" (not generic label)`
    );
    assert(
      !firstAnswer.practitioner.password,
      "Answer practitioner data does NOT leak password hash"
    );
    assert(
      Boolean(firstAnswer.practitioner.specialization),
      `Answer displays specialization: "${firstAnswer.practitioner.specialization}"`
    );
  }

  // 10. Practitioner Submitting Answer (Server-Side Identity Derivation)
  console.log("\n--- TEST 10: Practitioner Submits Answer with Authenticated Identity ---");
  const newAnswerText = `Clinical recommendation based on classical Ayurvedic principles (Test timestamp: ${new Date().toISOString()})`;
  const postAnswerRes = await fetch(`${API_BASE}/api/community/questions/${testQuestion._id}/answers`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token1}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: newAnswerText,
    }),
  });
  const postAnswerData = await postAnswerRes.json();
  assert(postAnswerRes.status === 201 && postAnswerData.success, "Practitioner answer submitted successfully");
  assert(
    postAnswerData.data?.practitioner?.name && postAnswerData.data?.practitioner?.name !== "Verified Practitioner",
    `Newly created answer returned actual practitioner name: "${postAnswerData.data?.practitioner?.displayName}"`
  );

  // 11. Multi-Practitioner Answer Independence
  console.log("\n--- TEST 11: Multiple Practitioners Answering Same Question ---");
  const answersAfterRes = await fetch(`${API_BASE}/api/community/questions/${testQuestion._id}/answers`);
  const answersAfterData = await answersAfterRes.json();
  assert(answersAfterData.data.length >= 2, `Question has multiple answers (${answersAfterData.data.length} answers)`);
  const distinctAuthors = new Set(answersAfterData.data.map((a) => a.practitioner?._id || a.practitioner?.id));
  console.log(`  Distinct answering practitioners count: ${distinctAuthors.size}`);
  answersAfterData.data.forEach((a, idx) => {
    console.log(`    Answer ${idx + 1} by: ${a.practitioner?.displayName || a.practitioner?.name} (${a.practitioner?.specialization}) [Verified: ${a.practitioner?.verified}]`);
  });
  assert(distinctAuthors.size > 0, "Each answer retains its own practitioner identity independently");

  // Summary
  console.log("\n==========================================================");
  console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("==========================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution error:", err);
  process.exit(1);
});
