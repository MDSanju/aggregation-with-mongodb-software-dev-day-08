// Aggregation examples

// Filter by gender and age
db.practiceMongooseQueries.aggregate([
    // Match stage
    { $match: { gender: 'Female', age: { $lte: 22, $gt: 16 } } },
    // Project stage
    { $project: { name: true, age: true, skills: true } },
])

// Update with a new field (salary) random amount, by creating a new collection
db.practiceMongooseQueries.aggregate([
    // Add field stage
    {
        $addFields: {
            salary: {
                $toInt: {
                    $floor: {
                        $multiply: [{ $rand: {} }, 100]
                    }
                }
            }
        }
    },
    // Project stage
    { $project: { salary: 1 } },
    // Out stage
    { $out: "salaryWithPracticeDb" }
])

// Update with a new field (salary) random amount, including all fields of DB by creating a new collection
db.practiceMongooseQueries.aggregate([
    // Add field stage
    {
        $addFields: {
            salary: {
                $toInt: {
                    $floor: {
                        $multiply: [{ $rand: {} }, 100]
                    }
                }
            }
        }
    },
    // Out stage
    { $out: "salaryWithPracticeDb" }
])

// Update with the random number's 'salary' field (It will never create a new collection rather it will merge the new field with the existing collection)
db.practiceMongooseQueries.aggregate([
    // Add field stage
    {
        $addFields: {
            salary: {
                $toInt: {
                    $floor: {
                        $multiply: [{ $rand: {} }, 100]
                    }
                }
            }
        }
    },
    // Merge stage
    { $merge: "practiceMongooseQueries" }
])

// Find data by unique grouping, it'll find only unique data by the reffered fields
db.practiceMongooseQueries.aggregate([
    // Group stage
    {
        $group: {
            _id: {
                age: "$age",
                gender: "$gender",
                favouriteColor: "$favouriteColor"
            }
        }
    }
])

// Grouping by salary & age of users
db.practiceMongooseQueries.aggregate([
    // Match stage
    {
        $match: {
            age: {
                $gte: 18
            }
        }
    },
    // Group stage
    {
        $group: {
            _id: "$salary",
            person: { $sum: 1 }
        }
    },
    // Project stage
    {
        $project: {
            _id: 0,
            salary: "$_id",
            person: 1
        }
    },
    // Sort stage
    {
        $sort: { _id: 1 }
    },
    // Limit stage
    {
        $limit: 5
    }
])

// We can use same stage many times if needed (match field 2 times used here)
db.practiceMongooseQueries.aggregate([
    // Match stage
    {
        $match: {
            age: {
                $gte: 18
            }
        }
    },
    {
        $match: {
            gender: 'Male'
        }
    },
    // Group stage
    {
        $group: {
            _id: "$salary",
            person: { $sum: 1 }
        }
    },
    // Project stage
    {
        $project: {
            _id: 0,
            salary: "$_id",
            person: 1
        }
    },
    // Sort stage
    {
        $sort: { _id: -1 }
    }
])

// Sum of all salary properties of the document to get total salary of stuffs
db.practiceMongooseQueries.aggregate([
    // Group stage
    {
        $group: {
            _id: null,
            totalSalary: { $sum: "$salary" }
        }
    }
])

// Group methods use, to get total salary, max salary, min salary and avg salary
db.practiceMongooseQueries.aggregate([
    // Group stage
    {
        $group: {
            _id: null,
            totalSalary: { $sum: "$salary" },
            highestSalary: { $max: "$salary" },
            lowestSalary: { $min: "$salary" },
            avgSalary: { $avg: "$salary" }
        }
    }
])

// Calculate the salary range between min & max salary of the company by using ($subtract) operator
db.practiceMongooseQueries.aggregate([
    // Group stage
    {
        $group: {
            _id: null,
            totalSalary: { $sum: "$salary" },
            highestSalary: { $max: "$salary" },
            lowestSalary: { $min: "$salary" },
            avgSalary: { $avg: "$salary" }
        }
    },
    // Project stage
    {
        $project: {
            count: 1,
            highestSalary: 1,
            lowestSalary: 1,
            avgSalary: 1,
            salaryRange: {
                $subtract: ["$highestSalary", "$lowestSalary"]
            }
        }
    }
])

// Use $unwind to get out elements from an array and make a new doc with each element of the array, then $group will provide unique documents
db.practiceMongooseQueries.aggregate([
    // Unwind stage
    {
        $unwind: "$education"
    },
    // Group stage
    {
        $group: {
            _id: "$education"
        }
    }
])

// Get all common docs quantity by using $sum 
db.practiceMongooseQueries.aggregate([
    // Unwind stage
    {
        $unwind: "$friends"
    },
    // Group stage
    {
        $group: {
            _id: "$friends",
            count: { $sum: 1 }
        }
    }
])

// Multiple pipelines by using $facet to make each pipeline work parallelly
db.practiceMongooseQueries.aggregate([
    // Match stage
    { $match: { _id: ObjectId("6406ad63fc13ae5a4000006b") } },
    // Multi pipelines
    {
        $facet: {
            // Sub pipeline 1
            "friendsCount": [
                // Project stage
                { $project: { friendsCount: { $size: "$friends" } } }
            ],
            // Sub pipeline 2
            "interestsCount": [
                // Project stage
                { $project: { interestsCount: { $size: "$interests" } } }
            ],
            // Sub pipeline 3
            "skillsCount": [
                // Project stage
                { $project: { skillsCount: { $size: "$skills" } } }
            ]
        }
    }
])

// $lookup by email field, to get additional information
db.salaryWithPracticeDb.aggregate([
    // Match stage
    { $match: { email: "weffnert2r@networkadvertising.org" } },
    // Lookup stage
    {
        $lookup: {
            from: "additionalInfo",
            localField: "email",
            foreignField: "userEmail",
            as: "additionalInformation"
        }
    }
])

// $lookup by _id: ObjectId()
db.salaryWithPracticeDb.aggregate([
    // Match stage
    { $match: { _id: ObjectId("6406ad65fc13ae5a400000c7") } },
    // Lookup stage
    {
        $lookup: {
            from: "additionalInfo",
            localField: "_id",
            foreignField: "userId",
            as: "additionalInformation"
        }
    }
])
