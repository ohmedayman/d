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
