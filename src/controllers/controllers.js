const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");
const db = require("../routes/db-app")

let login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send("<h1>Plz Enter data on request body</h1>")
        }
        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
            console.log(results);
            if (!results || !await bcrypt.compare(password, results[0].password)) {
                res.status(401).send( "<h1>Email or Password is incorrect</h1>")
                
            } else {
                const id = results[0].id;

                const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log("the token is " + token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }
                res.cookie('userSave', token, cookieOptions);
                res.status(200).redirect("/");
            }
        })
    } catch (err) {
        console.log(err);
    }
}
let register = (req, res) => {
    console.log(req.body);
    const { name, email, password, passwordConfirm } = req.body;
    db.query('SELECT email from users WHERE email = ?', [email], async (err, results) => {
        if (err) {
            console.log(err);
        } else {
            if (results.length > 0) {
                return res.send("<h1>Email Already Present</h1>")

            } else if (password != passwordConfirm) {
                return res.send("<h3>PLZ Enter Valid Password </h3>")
            }
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        db.query('INSERT INTO users SET ?', { name: name, email: email, password: hashedPassword }, (err, results) => {
            if (err) {
                console.log(err);
            } else {
                return res.send( "<h4>User registered</h4>");
            }
        })
    })
    res.send("Form submitted");
}

let isLoggedIn = async (req, res, next) => {
    if (req.cookies.userSave) {
        try {
            // 1. Verify the token
            const decoded = await promisify(jwt.verify)(req.cookies.userSave,
                process.env.JWT_SECRET
            );
            console.log(decoded);

            // 2. Check if the user still exist
            db.query('SELECT * FROM users WHERE id = ?', [decoded.id], (err, results) => {
                console.log(results);
                if (!results) {
                    return next();
                }
                req.user = results[0];
                return next();
            });
        } catch (err) {
            console.log(err)
            return next();
        }
    } else {
        next();
    }
}
let logout = (req, res) => {
    res.cookie('userSave', 'logout', {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly: true
    });
    res.status(200).redirect("/");
}


module.exports={login,register,logout,isLoggedIn}


/*const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookie=require('cookie-parser')
const connection=require('./config')
const app = express();
app.use('/assets',express.static("assets"))
app.use(express.json())
app.set('view engine','ejs')
app.get('/', (req, res) => {
    res.render('home')
})
app.post('/register', async (req, res) => {
    const { email, password:Npassword } = req.body;
    if (!email || !Npassword)
        return res.json({ status: "error", error: "Please enter email or password" })
    else {
        connection.query('SELECT email FROM users WHERE email=?', [email], async (err, result) => {
            if (err) throw err
            if (result[0])
                return res.json({ status: "error", error: "Email is already registered" })
            else {
                const password = await bcrypt.hash(Npassword, 8)
               
                connection.query('INSERT INTO users SET ?', { email: email, password: password }, (err, result) => {
                    if (err)
                        throw err
                    return res.json({status:"success",success:"User has been registered successfully..!!"})
                })
            }
        })
    }
})
app.get("/login", async (req, res) => {
    const { email, password } = req.body
    if (!email || !password)
        return res.json({ status: "error", error: "Please enter email or password" })
    else {
        connection.query('SELECT * FROM users WHERE email=?', [email], async (err, result) => {
            if (err) throw err
            if (!result.length>0 || ! await bcrypt.compare(password, result[0].password))
                return res.json({ status: "error", error: "Incorrect Email or password" })
            else {
                const token = jwt.sign({ id: result[0].id }, "myfisrtmysqlassignment", {
                    expiresIn: 24 * 60 * 60 * 1000
                })
                const cookieOptions = {
                    expiresIn: new Date(Date.now() + 24 * 60 * 60 * 1000),
                    httpOnly:true
                }
                res.cookie("userRegistered", token, cookieOptions);
                return res.json({status:"success",success:"User has been logged in"})
            }
        })
    }
    res.render('login')
})
app.listen(3030)*/