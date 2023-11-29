const session = require('express-session')
const User=require('../models/userModel')
const bcrypt=require('bcrypt')

//hashing  password 
const securePassword=async (password)=>{
    try {
        const passwordHash=await bcrypt.hash(password, 10)
        return passwordHash
    } catch (error) {
        console.log(error.message)
    }
}

// render register page
const loadRegister=async (req, res)=>{
   try {
    res.render('user/register')
    
   } catch (error) {
    console.log(error.message);
   }
}


// insert form data into database as an user
const insertUser=async (req, res)=>{
    try {
        const userExists=await User.findOne({email:req.body.email}) 
        if(userExists){
          res.render('user/register',{message:null,error:'user already exists'})
        }
        const secpassword=await securePassword(req.body.password)
        const user=new User({
            name:req.body.name,
            email:req.body.email,
            password:secpassword,
            mobile:req.body.mobile,
        })
        const userData=await user.save()
        if(userData){
            res.redirect('/login')
        }else{
            res.render('user/register',{error:'registration failed',message:null})
        }
    } catch (error) {
        console.log(error.message);
    }
}


//render login page
const showLogin=async (req, res)=>{
    try {
        res.render('user/Userlogin')
    } catch (error) {
        console.log(error.message);
    }
}


// enter to user-dashboard page when logined by validation of email and password
const validlogin = async (req, res)=>{
    const {email,password,}=req.body
    try {
        const user = await User.findOne({email}) //validate email
        if(!user){
          return res.render('user/Userlogin',{ message:null, error:'User not found' })
        }
        const isMatch = await bcrypt.compare(password, user.password)  //validate password
        if (!isMatch){ 
            return res.render('user/Userlogin',{ message:null, error:'Wrong password' })
        }

        if (user.isVerified===1){
            req.session.user = user._id   //creating a session id using a key-value pair
            res.redirect('/')
        }else{
            res.render('user/Userlogin',{ message:null, error:'please wait until admin is verified you..' })
        }
        
    } catch (error) {
        console.log(error.message);
    }
}


const showDashboard=async (req, res)=>{
    try {
        const user=await User.findById(req.user)
        res.render('user/userDashboard',{user})
    } catch (error) {
        console.log(error.message)
    }
}


const editProfile=async (req,res)=>{
    const {id}=req.params
    const user=await User.findById({_id:id})
    try {
        res.render('user/edit',{user})
    } catch (error) {
        console.log(error.message)
    }
}

const updateUser=async (req,res)=>{
    const {id}=req.params
    const {name,email,mobile,password}=req.body
    
    try {
        const user=await User.findByIdAndUpdate(id,
            {$set:{
                name,
                email,
                mobile,
                password
            }},{new:true})
        res.render('user/userDashboard')
    } catch (error) {
        console.log(error.message)
    }
}



const logout=async (req,res)=>{
    req.session.destroy()
    res.redirect('/login')
}




module.exports={
    loadRegister,
    insertUser,
    showLogin,
    validlogin,
    showDashboard,
    editProfile,
    updateUser,
    logout
}

