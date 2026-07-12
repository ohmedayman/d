const DB = {
    async add(collection, item) {
        item.createdAt = item.createdAt || new Date().toISOString();
        const docRef = await firebase.firestore().collection(collection).add(item);
        item.id = docRef.id;
        await docRef.update({ id: docRef.id });
        return { ...item, id: docRef.id };
    },

    async set(collection, id, data) {
        data.updatedAt = new Date().toISOString();
        await firebase.firestore().collection(collection).doc(id).set(data, { merge: true });
        return { ...data, id };
    },

    async getAll(collection, orderBy = 'createdAt', direction = 'desc') {
        const snapshot = await firebase.firestore().collection(collection).orderBy(orderBy, direction).get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    async getWhere(collection, field, operator, value) {
        const snapshot = await firebase.firestore().collection(collection).where(field, operator, value).get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    async getOne(collection, id) {
        const doc = await firebase.firestore().collection(collection).doc(id).get();
        return doc.exists ? { id: doc.id, ...doc.data() } : null;
    },

    async remove(collection, id) {
        await firebase.firestore().collection(collection).doc(id).delete();
    },

    async update(collection, id, data) {
        data.updatedAt = new Date().toISOString();
        await firebase.firestore().collection(collection).doc(id).update(data);
        return { ...data, id };
    },

    async count(collection, field, operator, value) {
        let ref = firebase.firestore().collection(collection);
        if (field) ref = ref.where(field, operator, value);
        const snapshot = await ref.count().get();
        return snapshot.data().count;
    },

    async getOrdersByDriver(driverPhone) {
        const snapshot = await firebase.firestore().collection('orders')
            .where('driverPhone', '==', driverPhone)
            .orderBy('createdAt', 'desc').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    onSnapshot(collection, callback) {
        return firebase.firestore().collection(collection)
            .orderBy('createdAt', 'desc')
            .onSnapshot(snapshot => {
                const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                callback(items);
            });
    },

    onSnapshotWhere(collection, field, operator, value, callback) {
        return firebase.firestore().collection(collection)
            .where(field, operator, value)
            .orderBy('createdAt', 'desc')
            .onSnapshot(snapshot => {
                const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                callback(items);
            });
    }
};
