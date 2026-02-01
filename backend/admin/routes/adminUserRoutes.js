const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Order = require('../../models/Order');
const adminAuth = require('../../admin/middleware/adminAuthMiddleware');

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with their last purchase date and activity status
 * @access  Admin only
 */
router.get('/', adminAuth, async (req, res) => {
  try {
    console.log('Fetching users...');
    
    // Calculate date 10 days ago
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
    console.log('Ten days ago:', tenDaysAgo);

    // Use aggregation to efficiently get user data with their last purchase
    const users = await User.aggregate([
      // Left join with orders to get user orders
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'user',
          as: 'orders'
        }
      },
      // Add computed fields for last purchase and activity status
      {
        $addFields: {
          lastPurchaseDate: {
            $cond: {
              if: { $gt: [{ $size: '$orders' }, 0] },
              then: { $max: '$orders.createdAt' },
              else: null
            }
          },
          totalOrders: { $size: '$orders' },
          hasOrders: { $gt: [{ $size: '$orders' }, 0] },
          activeInLast10Days: {
            $and: [
              { $gt: [{ $size: '$orders' }, 0] },
              { $gte: [{ $max: '$orders.createdAt' }, tenDaysAgo] }
            ]
          },
          // Set isActive to true for users who have purchased in the last 10 days
          isActive: {
            $and: [
              { $gt: [{ $size: '$orders' }, 0] },
              { $gte: [{ $max: '$orders.createdAt' }, tenDaysAgo] }
            ]
          }
        }
      },
      // Project only the fields we need
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          createdAt: 1,
          lastPurchaseDate: 1,
          isActive: 1,
          activeInLast10Days: 1,
          totalOrders: 1
        }
      },
      // Sort by last purchase date (most recent first), then by name
      {
        $sort: {
          lastPurchaseDate: -1,
          name: 1
        }
      }
    ]);

    console.log('Processed users:', users.length);
    res.json({
      success: true,
      data: users,
      count: users.length
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/admin/users/stats
 * @desc    Get user statistics summary
 * @access  Admin only
 */
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const stats = await User.aggregate([
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'userId',
          as: 'orders'
        }
      },
      {
        $addFields: {
          hasOrders: { $gt: [{ $size: '$orders' }, 0] },
          activeInLast7Days: {
            $and: [
              { $gt: [{ $size: '$orders' }, 0] },
              { $gte: [{ $max: '$orders.createdAt' }, sevenDaysAgo] }
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          usersWithOrders: {
            $sum: { $cond: ['$hasOrders', 1, 0] }
          },
          activeInLast7Days: {
            $sum: { $cond: ['$activeInLast7Days', 1, 0] }
          },
          inactiveUsers: {
            $sum: { $cond: [{ $not: '$hasOrders' }, 1, 0] }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalUsers: 1,
          usersWithOrders: 1,
          activeInLast7Days: 1,
          inactiveUsers: 1,
          conversionRate: {
            $multiply: [
              { $divide: ['$usersWithOrders', '$totalUsers'] },
              100
            ]
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: stats[0] || {
        totalUsers: 0,
        usersWithOrders: 0,
        activeInLast7Days: 0,
        inactiveUsers: 0,
        conversionRate: 0
      }
    });

  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user statistics',
      error: error.message
    });
  }
});

module.exports = router;