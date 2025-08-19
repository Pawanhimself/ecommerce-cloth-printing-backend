const bcrypt = require("bcrypt");
const { User, validateRegistration, validateLogin } = require("../models/User")

// for user registration
exports.userRegister = async (req,res) => {
    try {
        const {error} = validateRegistration(req.body);

        if(error)
            return res.status(400).send({success: false,message: error.details[0].message });

        const user = await User.findOne({ email: req.body.email });

        if(user)
            return res.status(409).send({success: false, message: "User already exists with this email."});
        
        const saltRounds = parseInt(process.env.SALT, 10);
        const salt = await bcrypt.genSalt(saltRounds);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        
        await new User({...req.body, password: hashPassword }).save();
        res.status(201).send({success: true, message: "User created successfully"});
    } catch (error) {
    console.log(error);
        res.status(500).send({success: false, message: "Internal Server Error"});
    }    
}

// for user login
exports.userLogin = async (req, res) => {
    try {
        const { error } = validateLogin(req.body);
        if(error)
            return res.status(400).send({success: false, message: error.details[0].message});

        const user = await User.findOne({email: req.body.email});
        if(!user)
            return res.status(401).send({success: false, message: "Invalid email or password"});

        //  Check for isActive
        if (!user.isActive)
            return res.status(403).send({success: false, message: "Your account has been deactivated" });

        const validPassword = await bcrypt.compare(req.body.password, user.password);

        if(!validPassword)
            return res.status(401).send({success: false, message: "Invalid password"});

        const token = user.generateAuthToken();
        res.status(200).send({success: true, token: token, message: "User logged in successfully"});

    } catch (error) {
        res.status(500).send({success: false, message: "Internal Server Error"});    
    }
}