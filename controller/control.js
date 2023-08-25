const logOut = (req, res) => {
    req.logOut(function (err) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/login");
      }
    });
  };
  
  module.exports={
      logOut,
  }