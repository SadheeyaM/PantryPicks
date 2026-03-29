const userClient = require("../clients/user");

exports.getUsers = async (req, res) => {
  try {
    const response = await userClient.getUsers(); 
    res.json(response.data);
    } catch (error) {   
    res.status(500).json({
        message: "Error while fetching users", 
    });
    }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;  
    const response = await userClient.getUserById(id);  
    if (!response.data) {
      return res.status(404).json({
        message: "User not found",
      }) ;
    }
    res.json(response.data); 
    } catch (error) {
    res.status(500).json({
        message: "Error while fetching user by ID",
    }) ;
    }
} ;

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params ;
        const userData = req.body ;
        const response = await userClient.updateUser(id, userData) ;
        res.json(response.data) ;
    }
    catch (error) {
        res.status(500).json({
            message: "Error while updating user",
        }) ;
    }
} ;  
