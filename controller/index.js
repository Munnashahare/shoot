
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/shootapp');
var db = mongoose.connection;


module.exports.dasboard_count_api = function (req, res) {


    db.collection('users').find({}).count().then((users) => {
        console.log("total_users: " + users);

        db.collection('merchants').find({}).count().then((merchants) => {
            console.log("total_merchants: " + merchants);

            db.collection('bookings').find({}).count().then((bookings) => {
                console.log("total_bookings: " + bookings);

                db.collection('services').find({}).count().then((services) => {
                    console.log("total_services: " + services);

                    db.collection('service_categories').find({}).count().then((service_categories) => {
                        console.log("total_categories: " + service_categories);

                        db.collection('bookings').find({ booking_status: "completed" }).count().then((cmp_bookings) => {
                            console.log("complete_bookings: " + cmp_bookings);


                            db.collection('bookings').find({ booking_status: "cancelled" }).count().then((cmpp_bookings) => {
                                console.log("cancelled_bookings: " + cmpp_bookings);


                                db.collection('service_primecategories').find({}).count().then((service_primecategories) => {
                                    console.log("total_prime_categories: " + service_primecategories);


                                    db.collection('merchants').find({ status: false }).count().then((non_ver_merchants) => {
                                        console.log("non_verified_merchants: " + non_ver_merchants);


                                        db.collection('merchants').find({ status: true }).count().then((ver_merchants) => {
                                            console.log("verified_merchants: " + ver_merchants);

                                            res.json({
                                                status: true, response: {
                                                    total_users: users,
                                                    total_merchants: merchants, total_bookings: bookings,
                                                    total_services: services, total_categories: service_categories,
                                                    complete_bookings: cmp_bookings, cancelled_bookings: cmpp_bookings,
                                                    total_prime_categories: service_primecategories, non_verified_merchants: non_ver_merchants,
                                                    verified_merchants: ver_merchants
                                                }
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
    return;

    Date.prototype.getWeek = function (start) {
        //Calcing the starting point
        start = start || 0;
        var today = new Date(this.setHours(0, 0, 0, 0));
        var day = today.getDay() - start;
        var date = today.getDate() - day;

        // Grabbing Start/End Dates
        var StartDate = new Date(today.setDate(date));
        var EndDate = new Date(today.setDate(date + 6));
        return [StartDate, EndDate];
    }

    const date = new Date();
    const monthstart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthend = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const yearstart = new Date(date.getFullYear(), 0, 1);
    const yearend = new Date(date.getFullYear() + 1, 0, 0);
    const weekstart = date.getWeek()[0];
    const weekend = date.getWeek()[1];

    let customer, category, merchant;

    db.collection('bookings').aggregate([
        {
            "$facet": {
                "todaycount": [
                    { "$match": { "createdAt": { "$gte": today } } },
                    { "$count": "todaycount" },
                ],
                "weekcount": [
                    { "$match": { "createdAt": { "$gte": weekstart, "$lt": weekend } } },
                    { "$count": "weekcount" },
                ],
                "monthcount": [
                    { "$match": { "createdAt": { "$gte": monthstart, "$lt": monthend } } },
                    { "$count": "monthcount" }
                ],
                "yearcount": [
                    { "$match": { "createdAt": { "$gte": yearstart, "$lt": yearend } } },
                    { "$count": "yearcount" }
                ],
                "totalcount": [
                    { "$count": "totalcount" }
                ]
            }
        },
        {
            "$project": {
                "todaycount": { "$arrayElemAt": ["$todaycount.todaycount", 0] },
                "weekcount": { "$arrayElemAt": ["$weekcount.weekcount", 0] },
                "monthcount": { "$arrayElemAt": ["$monthcount.monthcount", 0] },
                "yearcount": { "$arrayElemAt": ["$yearcount.yearcount", 0] },
                "totalcount": { "$arrayElemAt": ["$totalcount.totalcount", 0] }
            }
        }
    ]).toArray(function (err, data) {
        if (err) return res.json(err);
        customer = data;

        db.collection('category').aggregate([
            {
                "$facet": {
                    "todaycount": [
                        { "$match": { "createdAt": { "$gte": today } } },
                        { "$count": "todaycount" },
                    ],
                    "weekcount": [
                        { "$match": { "createdAt": { "$gte": weekstart, "$lt": weekend } } },
                        { "$count": "weekcount" },
                    ],
                    "monthcount": [
                        { "$match": { "createdAt": { "$gte": monthstart, "$lt": monthend } } },
                        { "$count": "monthcount" }
                    ],
                    "yearcount": [
                        { "$match": { "createdAt": { "$gte": yearstart, "$lt": yearend } } },
                        { "$count": "yearcount" }
                    ],
                    "totalcount": [
                        { "$count": "totalcount" }
                    ]
                }
            },
            {
                "$project": {
                    "todaycount": { "$arrayElemAt": ["$todaycount.todaycount", 0] },
                    "weekcount": { "$arrayElemAt": ["$weekcount.weekcount", 0] },
                    "monthcount": { "$arrayElemAt": ["$monthcount.monthcount", 0] },
                    "yearcount": { "$arrayElemAt": ["$yearcount.yearcount", 0] },
                    "totalcount": { "$arrayElemAt": ["$totalcount.totalcount", 0] }
                }
            }
        ]).toArray(function (err, data) {
            if (err) return res.json({ status: false, response: err });
            category = data;

            // db.collection('deliveryboys').aggregate([
            // 	{ "$facet": {
            // 	  "todaycount": [
            // 		{ "$match" : { "createdAt": { "$gte": today } } },
            // 		{ "$count": "todaycount" },
            // 	  ],
            // 	  "weekcount": [
            // 		{ "$match" : { "createdAt": { "$gte": weekstart, "$lt": weekend } } },
            // 		{ "$count": "weekcount" },
            // 	  ],
            // 	  "monthcount": [
            // 		{ "$match" : {"createdAt": { "$gte": monthstart, "$lt": monthend }}},
            // 		{ "$count": "monthcount" }
            // 	  ],
            // 	  "yearcount": [
            // 		{ "$match" : {"createdAt": { "$gte": yearstart, "$lt": yearend }}},
            // 		{ "$count": "yearcount" }
            // 	  ],
            // 	  "totalcount": [
            // 		{ "$count": "totalcount" }
            // 	  ]
            // 	}},
            // 	{ "$project": {
            // 	  "todaycount": { "$arrayElemAt": ["$todaycount.todaycount", 0] },
            // 	  "weekcount": { "$arrayElemAt": ["$week                                                                                   count.weekcount", 0] },
            // 	  "monthcount": { "$arrayElemAt": ["$monthcount.monthcount", 0] },
            // 	  "yearcount": { "$arrayElemAt": ["$yearcount.yearcount", 0] },
            // 	  "totalcount": { "$arrayElemAt": ["$totalcount.totalcount", 0] }
            // 	}}
            // ]).toArray(function(err, data) {
            // 	if (err) return res.json(err);
            // 	deliveryboy = data;

            db.collection('merchant').aggregate([
                {
                    "$facet": {
                        "todaycount": [
                            { "$match": { "createdAt": { "$gte": today } } },
                            { "$count": "todaycount" },
                        ],
                        "weekcount": [
                            { "$match": { "createdAt": { "$gte": weekstart, "$lt": weekend } } },
                            { "$count": "weekcount" },
                        ],
                        "monthcount": [
                            { "$match": { "createdAt": { "$gte": monthstart, "$lt": monthend } } },
                            { "$count": "monthcount" }
                        ],
                        "yearcount": [
                            { "$match": { "createdAt": { "$gte": yearstart, "$lt": yearend } } },
                            { "$count": "yearcount" }
                        ],
                        "totalcount": [
                            { "$count": "totalcount" }
                        ]
                    }
                },
                {
                    "$project": {
                        "todaycount": { "$arrayElemAt": ["$todaycount.todaycount", 0] },
                        "weekcount": { "$arrayElemAt": ["$weekcount.weekcount", 0] },
                        "monthcount": { "$arrayElemAt": ["$monthcount.monthcount", 0] },
                        "yearcount": { "$arrayElemAt": ["$yearcount.yearcount", 0] },
                        "totalcount": { "$arrayElemAt": ["$totalcount.totalcount", 0] }
                    }
                }
            ]).toArray(function (err, data) {
                if (err) return res.json({ status: false, response: err });
                merchant = data;
                // return res.json({order: order, customer: customer,  vendor: vendor});
                return res.json({ status: true, response: { data: "Dashboard", count: { customer: customer[0], category: category[0], merchant: merchant[0] } } })
            });
        });

    });

}