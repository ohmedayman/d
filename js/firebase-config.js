/* ========================================
   خليك مكانك - Firebase Configuration
   ======================================== */

// Firebase configuration
// IMPORTANT: Replace these values with your actual Firebase config
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy, where } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Export for use in other files
export { db, auth, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy, where, signInWithEmailAndPassword, signOut, onAuthStateChanged };

/* ========================================
   Database Collections
   ======================================== */
export const COLLECTIONS = {
    ORDERS: 'orders',
    CUSTOMERS: 'customers',
    DRIVERS: 'drivers',
    SETTINGS: 'settings'
};

/* ========================================
   Orders Functions
   ======================================== */
export async function createOrder(orderData) {
    try {
        const docRef = await addDoc(collection(db, COLLECTIONS.ORDERS), {
            ...orderData,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Error creating order:', error);
        return { success: false, error: error.message };
    }
}

export async function getOrders() {
    try {
        const q = query(collection(db, COLLECTIONS.ORDERS), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const orders = [];
        querySnapshot.forEach((doc) => {
            orders.push({ id: doc.id, ...doc.data() });
        });
        return { success: true, data: orders };
    } catch (error) {
        console.error('Error getting orders:', error);
        return { success: false, error: error.message };
    }
}

export async function updateOrderStatus(orderId, status) {
    try {
        const orderRef = doc(db, COLLECTIONS.ORDERS, orderId);
        await updateDoc(orderRef, {
            status: status,
            updatedAt: new Date().toISOString()
        });
        return { success: true };
    } catch (error) {
        console.error('Error updating order:', error);
        return { success: false, error: error.message };
    }
}

export async function deleteOrder(orderId) {
    try {
        await deleteDoc(doc(db, COLLECTIONS.ORDERS, orderId));
        return { success: true };
    } catch (error) {
        console.error('Error deleting order:', error);
        return { success: false, error: error.message };
    }
}

/* ========================================
   Customers Functions
   ======================================== */
export async function createCustomer(customerData) {
    try {
        const docRef = await addDoc(collection(db, COLLECTIONS.CUSTOMERS), {
            ...customerData,
            createdAt: new Date().toISOString()
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Error creating customer:', error);
        return { success: false, error: error.message };
    }
}

export async function getCustomers() {
    try {
        const q = query(collection(db, COLLECTIONS.CUSTOMERS), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const customers = [];
        querySnapshot.forEach((doc) => {
            customers.push({ id: doc.id, ...doc.data() });
        });
        return { success: true, data: customers };
    } catch (error) {
        console.error('Error getting customers:', error);
        return { success: false, error: error.message };
    }
}

/* ========================================
   Drivers Functions
   ======================================== */
export async function createDriver(driverData) {
    try {
        const docRef = await addDoc(collection(db, COLLECTIONS.DRIVERS), {
            ...driverData,
            status: 'available',
            createdAt: new Date().toISOString()
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Error creating driver:', error);
        return { success: false, error: error.message };
    }
}

export async function getDrivers() {
    try {
        const q = query(collection(db, COLLECTIONS.DRIVERS), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const drivers = [];
        querySnapshot.forEach((doc) => {
            drivers.push({ id: doc.id, ...doc.data() });
        });
        return { success: true, data: drivers };
    } catch (error) {
        console.error('Error getting drivers:', error);
        return { success: false, error: error.message };
    }
}

/* ========================================
   Statistics Functions
   ======================================== */
export async function getStatistics() {
    try {
        const orders = await getOrders();
        const customers = await getCustomers();
        const drivers = await getDrivers();
        
        if (!orders.success || !customers.success || !drivers.success) {
            throw new Error('Failed to fetch data');
        }
        
        const totalOrders = orders.data.length;
        const totalCustomers = customers.data.length;
        const totalDrivers = drivers.data.length;
        
        const pendingOrders = orders.data.filter(o => o.status === 'pending').length;
        const completedOrders = orders.data.filter(o => o.status === 'completed').length;
        const cancelledOrders = orders.data.filter(o => o.status === 'cancelled').length;
        
        const totalRevenue = orders.data
            .filter(o => o.status === 'completed')
            .reduce((sum, o) => sum + (o.deliveryFee || 0), 0);
        
        return {
            success: true,
            data: {
                totalOrders,
                totalCustomers,
                totalDrivers,
                pendingOrders,
                completedOrders,
                cancelledOrders,
                totalRevenue
            }
        };
    } catch (error) {
        console.error('Error getting statistics:', error);
        return { success: false, error: error.message };
    }
}
