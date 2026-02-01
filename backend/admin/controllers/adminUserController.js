const User = require('../../models/User');
const Order = require('../../models/Order');

/**
 * @desc    Get all users with their last purchase date and activity status
 * @route   GET /api/admin/users
 * @access  Admin only
 */
const getUsers = async (req, res) => {
  try {
    console.log('Fetching users...');
    
    // Calculate date 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    console.log('Seven days ago:', sevenDaysAgo);

    // First, get all users
    const allUsers = await User.find({}).lean();
    console.log('Total users found:', allUsers.length);

    // Get all orders to map to users
    const allOrders = await Order.find({}).lean();
    console.log('Total orders found:', allOrders.length);

    // Group orders by userId for efficient lookup
    const ordersByUserId = {};
    allOrders.forEach(order => {
      if (!ordersByUserId[order.userId]) {
        ordersByUserId[order.userId] = [];
      }
      ordersByUserId[order.userId].push(order);
    });

    // Process users with their order information
    const users = allUsers.map(user => {
      const userOrders = ordersByUserId[user._id] || [];
      const lastPurchaseDate = userOrders.length > 0 
        ? new Date(Math.max(...userOrders.map(order => new Date(order.createdAt))))
        : null;
      
      const hasOrders = userOrders.length > 0;
      const activeInLast7Days = hasOrders && lastPurchaseDate >= sevenDaysAgo;

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        lastPurchaseDate: hasOrders ? lastPurchaseDate : null,
        isActive: hasOrders,
        activeInLast7Days: activeInLast7Days,
        totalOrders: userOrders.length
      };
    });

    // Sort by last purchase date (most recent first), then by name
    users.sort((a, b) => {
      if (a.lastPurchaseDate && b.lastPurchaseDate) {
        return b.lastPurchaseDate - a.lastPurchaseDate;
      }
      if (a.lastPurchaseDate) return -1;
      if (b.lastPurchaseDate) return 1;
      return a.name.localeCompare(b.name);
    });

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
};

/**
 * @desc    Get user statistics summary
 * @route   GET /api/admin/users/stats
 * @access  Admin only
 */
const getUserStats = async (req, res) => {
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
};

/**
 * @desc    Get a specific user by ID with their order history
 * @route   GET /api/admin/users/:id
 * @access  Admin only
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's orders
    const orders = await Order.find({ userId: id })
      .sort({ createdAt: -1 })
      .limit(10); // Get last 10 orders

    // Calculate activity status
    const hasOrders = orders.length > 0;
    const lastPurchaseDate = hasOrders ? orders[0].createdAt : null;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const activeInLast7Days = hasOrders && lastPurchaseDate >= sevenDaysAgo;

    res.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        },
        orderHistory: orders,
        lastPurchaseDate,
        isActive: hasOrders,
        activeInLast7Days,
        totalOrders: orders.length
      }
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user',
      error: error.message
    });
  }
};

/**
 * @desc    Delete a user and their associated orders
 * @route   DELETE /api/admin/users/:id
 * @access  Admin only
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete user's orders first (referential integrity)
    await Order.deleteMany({ userId: id });

    // Delete user
    await User.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting user',
      error: error.message
    });
  }
};

module.exports = {
  getUsers,
  getUserStats,
  getUserById,
  deleteUser
};