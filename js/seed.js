async function seedDemoDataIfEmpty() {
    try {
        const ordersSnap = await firebase.firestore().collection('orders').limit(1).get();
        if (!ordersSnap.empty) return;

        const batch = firebase.firestore().batch();
        const now = Date.now();

        const demoOrders = [
            { orderId:'ORD-001', customerName:'أحمد محمد', customerPhone:'01012345678', customerAddress:'الفيوم - شارع الجمهورية', serviceType:'food', deliveryFee:15, status:'completed', driverName:'محمد علي', driverPhone:'01123456789', notes:'توصيل سريع', createdAt:new Date(now-86400000*2).toISOString(), completedAt:new Date(now-86400000*2+3600000).toISOString() },
            { orderId:'ORD-002', customerName:'سارة أحمد', customerPhone:'01234567890', customerAddress:'الفيوم - شارع الحرية', serviceType:'package', deliveryFee:20, status:'delivering', driverName:'حسن محمود', driverPhone:'01098765432', notes:'', createdAt:new Date(now-3600000*5).toISOString() },
            { orderId:'ORD-003', customerName:'محمد حسن', customerPhone:'01155566677', customerAddress:'الفيوم - شارع المدارس', serviceType:'product', deliveryFee:25, status:'pending', driverName:'', driverPhone:'', notes:'هدايا عيد ميلاد', createdAt:new Date(now-3600000*2).toISOString() },
            { orderId:'ORD-004', customerName:'فاطمة علي', customerPhone:'01088899900', customerAddress:'الفيوم - حي الغردقة', serviceType:'food', deliveryFee:15, status:'confirmed', driverName:'', driverPhone:'', notes:'', createdAt:new Date(now-3600000).toISOString() },
            { orderId:'ORD-005', customerName:'عمر سعيد', customerPhone:'01512345678', customerAddress:'الفيوم - شارع بنك مصر', serviceType:'food', deliveryFee:15, status:'picked', driverName:'محمد علي', driverPhone:'01123456789', notes:'', createdAt:new Date(now-3600000*8).toISOString() },
        ];
        demoOrders.forEach(o => {
            const ref = firebase.firestore().collection('orders').doc();
            batch.set(ref, o);
        });

        const demoDrivers = [
            { name:'محمد علي', phone:'01123456789', bike:'موتوسيكل 123', area:'وسط الفيوم', status:'available', orderCount:15, createdAt:new Date(now-86400000*30).toISOString() },
            { name:'حسن محمود', phone:'01098765432', bike:'موتوسيكل 456', area:'شارع الجمهورية', status:'busy', orderCount:22, createdAt:new Date(now-86400000*20).toISOString() },
            { name:'يوسف إبراهيم', phone:'01555555555', bike:'موتوسيكل 789', area:'الغردقة', status:'available', orderCount:8, createdAt:new Date(now-86400000*10).toISOString() },
        ];
        demoDrivers.forEach(d => {
            const ref = firebase.firestore().collection('drivers').doc();
            batch.set(ref, d);
        });

        const demoCustomers = [
            { name:'أحمد محمد', phone:'01012345678', address:'الفيوم - شارع الجمهورية', orderCount:5, totalSpent:75, lastOrder:new Date(now-86400000*2).toISOString(), createdAt:new Date(now-86400000*60).toISOString() },
            { name:'سارة أحمد', phone:'01234567890', address:'الفيوم - شارع الحرية', orderCount:3, totalSpent:60, lastOrder:new Date(now-3600000*5).toISOString(), createdAt:new Date(now-86400000*40).toISOString() },
            { name:'محمد حسن', phone:'01155566677', address:'الفيوم - شارع المدارس', orderCount:8, totalSpent:200, lastOrder:new Date(now-3600000*2).toISOString(), createdAt:new Date(now-86400000*90).toISOString() },
        ];
        demoCustomers.forEach(c => {
            const ref = firebase.firestore().collection('customers').doc();
            batch.set(ref, c);
        });

        await batch.commit();
        console.log('Demo data seeded successfully!');
    } catch(e) {
        console.log('Seed error:', e);
    }
}
