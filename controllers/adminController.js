const session = require('express-session')
const bcrypt=require('bcrypt')
const { showDashboard } = require('./userController')
const User = require('../models/userModel')

// class RandomString {
//     static generate(length) {
//         let id
//         const prifixx = 'abscdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789?><!@#$%^&*()'
//         for (let i = 0; i < length; i++) {
//             id += prifixx.charAt(Math.floor(Math.random() * prifixx.length))
//         }
//         return id
//     }
// }

//hashing  password 
const securePassword=async (password)=>{
    try {
        const passwordHash=await bcrypt.hash(password, 10)
        return passwordHash
    } catch (error) {
        console.log(error.message)
    }
}

const showLogin=async (req,res)=>{
    try {
        res.render('admin/Adminlogin',{message:null,error:null})
    } catch (error) {
        console.log(error.message)
    }
}

//valid login of  admin
const validlogin = async (req, res)=>{
    const {email,password}=req.body
    try {
        const user = await User.findOne({email}) //validate email
        if(!user){
          return res.render('admin/Adminlogin',{ message:null, error:'User not found' })
        }
        const isMatch = await bcrypt.compare(password, user.password)  //validate password
        if (!isMatch){ 
            return res.render('admin/Adminlogin',{ message:null, error:'Wrong password' })
        }

        if(user.isAdmin===1){
            req.session.admin = user._id   //creating a session id using a key-value pair
            res.redirect('/admin/dashboard')
        }else{
            res.redirect('/login')
        }

    } catch (error) {
        console.log(error.message);
    }
}


  const showUsers=async (req,res)=>{
    const { q } = req.query
    try {
        let users;
        if (q) {
            users = await User.find({ name: { $regex: '.*' + q + '.*' }, isAdmin: 0 })
        } else {
            users=await User.find({ isAdmin: 0 })   // Fetch all users from the database
        }
        res.render('admin/adminDash',{users})
    } catch (error) {
        console.log(error.message)
    }
  }

  const showEditUser=async (req,res)=>{
    const {id}= req.params
    try {
        const user = await User.findById(id)
        res.render('admin/editUser', {user})
    } catch (error) {
        console.log(error.message)
    }
  }

  const updateUser = async (req,res) => {
    const { id } = req.params
    const { name,email,mobile,isVerified } = req.body; 
    try {
      const user = await  User.findByIdAndUpdate(id,{
        $set:{
            name,
            email,
            mobile,
            isVerified
        }
      },{new:true}) 
      res.redirect('/admin/dashboard')
    } catch (error) {
    console.log(error.message);        
    }
  }



  const deleteUser=async (req,res)=>{
    const { id }=req.params
    try {
        const user=await User.findOneAndDelete({_id:id})
        if(req.session.user_session=== user._id){
            req.session.destroy()
        }
        return res.redirect('/admin/dashboard')
    } catch (error) {
        console.log(error.message)
    }
  }

  const newUser = async (req, res) => {
    const { name, email, mobile, isVerified } = req.body
    try {
        return res.render('admin/new', { error: null })
    } catch (error) {
        res.render('admin/new', { error: 'Somthing went wrong' })
    }
  }

  
  const createUser = async (req, res) => {
    const { name, email, mobile, isVerified } = req.body
    try {
        const exists = await User.findOne({ email })
        if (exists) return res.render('admin/new', { error: "User already exists." })
        const secpassword=await securePassword(req.body.password)
        const user = new User({ name, email, mobile, password: secpassword, isVerified })
        await user.save()
        return res.redirect('/admin/dashboard')
    } catch (error) {
        res.render('admin/new', { error: 'Somthing went wrong' })
    }
  }


  const logout=async (req,res)=>{
    req.session.destroy()
    res.redirect('/login')
  }






module.exports={
    showLogin,
    validlogin,
    showUsers,
    showEditUser,
    updateUser,
    deleteUser,
    newUser,
    createUser,
    logout
}