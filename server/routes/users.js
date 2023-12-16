const router = require("express").Router();
const {User, validate} = require("../models/users")
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await User.findOne({ email: req.body.email });
		if (user)
			return res
				.status(409)
				.send({ message: "User with given email already Exist!" });

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		await new User({ ...req.body, password: hashPassword }).save();
		res.status(201).send({ message: "User created successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}

    // router.get("/profile", async (req, res) => {
    //     try {
    //       const userId = req.user._id; 
    //       const user = await User.findById(userId);
      
    //       if (!user) {
    //         return res.status(404).send({ message: "User not found" });
    //       }
      
    //       res.status(200).send({
    //         data: {
    //           username: user.username,
    //           email: user.email,
    //         },
    //       });
    //     } catch (error) {
    //       console.error("Error fetching user profile", error);
    //       res.status(500).send({ message: "Internal Server Error" });
    //     }
    //   });
    app.get('/api/profile',  (req, res) => {
        const user = user.find((u) => u.id === req.user.id);
      
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
      
        res.json({
          username: user.username,
          email: user.email,
        });
      });
});

module.exports = router;