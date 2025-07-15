const bcrypt = require("bcrypt");
const { User, validateRegistration, validateLogin } = require("../models/User")

// for user registration
exports.userRegister = async (req,res) => {
    try {
        const {error} = validateRegistration(req.body);

        if(error)
            return res.status(400).send({message: error.details[0].message });

        const user = await User.findOne({ email: req.body.email });

        if(user)
            return res.status(409).send({message: "User already exists with this email."});
        
        const saltRounds = parseInt(process.env.SALT, 10);
        const salt = await bcrypt.genSalt(saltRounds);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        
        await new User({...req.body, password: hashPassword }).save();
        res.status(201).send({message: "User created successfully"});
    } catch (error) {
    console.log(error);
        res.status(500).send({message: "Internal Server Error"});
    }    
}

// for user login
exports.userLogin = async (req, res) => {
    try {
        const { error } = validate(req.body);
        if(error)
            res.status(400).send({message: error.details[0].message});

        const user = await User.findOne({email: req.body.email});
        if(!user)
            res.status(401).send({message: "Invalid email or password"});

            const validPassword = await bcrypt.compare(req.body.password, user.password);

        if(!validPassword)
            return res.status(401).send({message: "Invalid email or password"});

        const token = user.generateAuthToken();
        res.status(200).send({data: token, message: "User logged in successfully"});
    
    } catch (error) {
        res.status(500).send({message: "Internal Server Error"});    
    }
}