import { 
  initializeTestEnvironment, 
  assertFails, 
  assertSucceeds 
} from '@firebase/rules-unit-testing';
import fs from 'fs';
import path from 'path';

const PROJECT_ID = 'sardarelectricalsandfurnitures';
const rules = fs.readFileSync(path.resolve('firestore.rules'), 'utf8');

async function runTests() {
  console.log('--- Initializing Firestore Security Rules Test Suite ---');
  let testEnv;
  let passed = 0;
  let failed = 0;

  try {
    testEnv = await initializeTestEnvironment({
      projectId: PROJECT_ID,
      firestore: {
        rules: rules,
        host: '127.0.0.1',
        port: 8080
      }
    });

    const unauthCtx = testEnv.unauthenticatedContext();
    const customerBobCtx = testEnv.authenticatedContext('bob', { email: 'bob@example.com' });
    const customerAliceCtx = testEnv.authenticatedContext('alice', { email: 'alice@example.com' });
    const adminCtx = testEnv.authenticatedContext('admin_user', { 
      email: 'admin@sardarelectricals.com',
      admin: true // Verified custom claim
    });

    const unauthDb = unauthCtx.firestore();
    const bobDb = customerBobCtx.firestore();
    const aliceDb = customerAliceCtx.firestore();
    const adminDb = adminCtx.firestore();

    const test = async (name, fn) => {
      try {
        await fn();
        console.log(`  [PASS] ${name}`);
        passed++;
      } catch (err) {
        console.error(`  [FAIL] ${name}:`, err.message);
        failed++;
      }
    };

    console.log('\n[Suite 1: Products & Catalog Permissions]');
    await test('Public users can read products', async () => {
      await assertSucceeds(unauthDb.collection('products').doc('p1').get());
    });

    await test('Unauthenticated users CANNOT create products', async () => {
      await assertFails(unauthDb.collection('products').doc('p1').set({ name: 'Hacked Sofa' }));
    });

    await test('Authenticated customers without admin claims CANNOT create products', async () => {
      await assertFails(bobDb.collection('products').doc('p1').set({ name: 'Hacked Sofa' }));
    });

    await test('Verified administrator WITH admin:true CAN create products', async () => {
      await assertSucceeds(adminDb.collection('products').doc('p1').set({
        name: 'Royal Sofa',
        price: 25000,
        active: true
      }));
    });

    console.log('\n[Suite 2: Customer User Profiles]');
    await test('Customer Bob can read his own user profile', async () => {
      // Setup doc first via admin
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection('users').doc('bob').set({
          uid: 'bob',
          email: 'bob@example.com',
          name: 'Bob'
        });
      });
      await assertSucceeds(bobDb.collection('users').doc('bob').get());
    });

    await test('Customer Bob CANNOT read Alice profile document', async () => {
      await assertFails(bobDb.collection('users').doc('alice').get());
    });

    await test('Customer Bob CANNOT set role="admin" on his own profile', async () => {
      await assertFails(bobDb.collection('users').doc('bob').set({
        uid: 'bob',
        role: 'admin',
        admin: true
      }));
    });

    console.log('\n[Suite 3: Orders Privacy & Integrity]');
    await test('Customer Bob can create an order where customerUid == "bob"', async () => {
      await assertSucceeds(bobDb.collection('orders').doc('order_bob_1').set({
        customerUid: 'bob',
        total: 5000,
        status: 'Order Placed'
      }));
    });

    await test('Customer Bob CANNOT create an order pretending to be customer "alice"', async () => {
      await assertFails(bobDb.collection('orders').doc('order_spoof').set({
        customerUid: 'alice',
        total: 5000,
        status: 'Order Placed'
      }));
    });

    await test('Customer Bob CANNOT read Alice orders', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection('orders').doc('order_alice_1').set({
          customerUid: 'alice',
          total: 12000,
          status: 'Order Placed'
        });
      });
      await assertFails(bobDb.collection('orders').doc('order_alice_1').get());
    });

    await test('Customer Bob CANNOT modify or tamper with his order total or status', async () => {
      await assertFails(bobDb.collection('orders').doc('order_bob_1').update({
        total: 1,
        status: 'Delivered',
        paymentStatus: 'Paid'
      }));
    });

    await test('Verified administrator can read and update all orders', async () => {
      await assertSucceeds(adminDb.collection('orders').doc('order_bob_1').get());
      await assertSucceeds(adminDb.collection('orders').doc('order_bob_1').update({
        status: 'Shipped'
      }));
    });

    console.log('\n[Suite 4: Enquiries & Contact]');
    await test('Unauthenticated visitors can submit enquiries', async () => {
      await assertSucceeds(unauthDb.collection('enquiries').add({
        name: 'Guest Shopper',
        message: 'Looking for 4K OLED TV'
      }));
    });

    await test('Visitors and customers CANNOT read other enquiries', async () => {
      await assertFails(bobDb.collection('enquiries').doc('any_enq').get());
    });

    await test('Verified administrator CAN read enquiries', async () => {
      await assertSucceeds(adminDb.collection('enquiries').doc('any_enq').get());
    });

    console.log('\n======================================================');
    console.log(`Results: ${passed} passed, ${failed} failed`);
    console.log('======================================================\n');

  } catch (error) {
    console.error('Test environment error:', error.message);
  } finally {
    if (testEnv) {
      await testEnv.cleanup();
    }
  }
}

runTests();
