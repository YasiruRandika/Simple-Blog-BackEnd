const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    const decodedToken = jwt.verify(token, "blogtestprojectbyyasirurandikausingangular");
    req.userData = {email : decodedToken.email, userId : decodedToken.userId};
    next();
  } catch {
    console.log("Authorization Failed");
    res.status(401).json({
      message : 'Auth Failed'
    })
  }
}
