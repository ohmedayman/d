const Auth = {
    async loginWithEmail(email, password) {
        return firebase.auth().signInWithEmailAndPassword(email, password);
    },

    async loginAnonymously() {
        return firebase.auth().signInAnonymously();
    },

    async logout() {
        return firebase.auth().signOut();
    },

    onAuthStateChanged(callback) {
        return firebase.auth().onAuthStateChanged(callback);
    },

    getCurrentUser() {
        return firebase.auth().currentUser;
    },

    isCustomerLoggedIn() {
        return !!localStorage.getItem('km_customer_uid');
    },

    getCustomer() {
        return {
            uid: localStorage.getItem('km_customer_uid') || '',
            email: localStorage.getItem('km_customer_email') || '',
            name: localStorage.getItem('km_customer_name') || '',
            phone: localStorage.getItem('km_customer_phone') || ''
        };
    },

    clearCustomer() {
        localStorage.removeItem('km_customer_uid');
        localStorage.removeItem('km_customer_email');
        localStorage.removeItem('km_customer_name');
        localStorage.removeItem('km_customer_phone');
    },

    async customerLogin(email, password) {
        return firebase.auth().signInWithEmailAndPassword(email, password);
    },

    async customerRegister(email, password, name, phone) {
        const result = await firebase.auth().createUserWithEmailAndPassword(email, password);
        await result.user.updateProfile({ displayName: name });
        await firebase.firestore().collection('customers').add({
            name, phone, email, uid: result.user.uid,
            orderCount: 0, totalSpent: 0,
            createdAt: new Date().toISOString()
        });
        localStorage.setItem('km_customer_uid', result.user.uid);
        localStorage.setItem('km_customer_email', email);
        localStorage.setItem('km_customer_name', name);
        localStorage.setItem('km_customer_phone', phone);
        return result;
    },

    async customerGoogleLogin() {
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await firebase.auth().signInWithPopup(provider);
        const user = result.user;
        localStorage.setItem('km_customer_uid', user.uid);
        localStorage.setItem('km_customer_email', user.email || '');
        localStorage.setItem('km_customer_name', user.displayName || '');
        localStorage.setItem('km_customer_phone', user.phoneNumber || '');
        const snap = await firebase.firestore().collection('customers').where('email', '==', user.email).limit(1).get();
        if (snap.empty) {
            await firebase.firestore().collection('customers').add({
                name: user.displayName || '', phone: user.phoneNumber || '',
                email: user.email || '', address: '', uid: user.uid,
                orderCount: 0, totalSpent: 0,
                createdAt: new Date().toISOString()
            });
        }
        return result;
    },

    async adminLogin(phone, password) {
        const email = phone + '@khalikmakana.admin';
        try {
            const result = await firebase.auth().signInWithEmailAndPassword(email, password);
            return { success: true, user: result.user };
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                try {
                    const result = await firebase.auth().createUserWithEmailAndPassword(email, password);
                    await firebase.firestore().collection('admins').doc(result.user.uid).set({
                        phone: phone,
                        role: 'admin',
                        createdAt: new Date().toISOString()
                    });
                    return { success: true, user: result.user };
                } catch (createError) {
                    return { success: false, error: createError.message };
                }
            }
            return { success: false, error: error.message };
        }
    },

    async driverLogin(phone, password) {
        const email = phone + '@khalikmakana.driver';
        try {
            const result = await firebase.auth().signInWithEmailAndPassword(email, password);
            return { success: true, user: result.user };
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                try {
                    const result = await firebase.auth().createUserWithEmailAndPassword(email, password);
                    return { success: true, user: result.user, isNew: true };
                } catch (createError) {
                    return { success: false, error: createError.message };
                }
            }
            return { success: false, error: error.message };
        }
    }
};
