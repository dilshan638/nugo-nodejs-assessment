var helpers = require('../helpers/common_functions');
var registrationModel = require('../../models/registration');
var  moment = require('moment');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv')
module.exports = {
    addUser : async function(req,res){
        try{
            if(!req.body.id || !req.body.name ||!req.body.email || !req.body.address || !req.body.city || !req.body.country){
                return res.status(400).json({
                      error: "Missing User Details",
              })
            }
            let id = await helpers.findOne(null,{id:req.body.id}, null, null, null, null, null, registrationModel);
            let email = await helpers.findOne(null,{email:req.body.email}, null, null, null, null, null, registrationModel);
             if(id != null){
                return res.status(403).json({error:"This ID already added"})
             }
             if(email != null){
                return res.status(403).json({error:"This Email already added"})
             }

             req.body.created_at=moment(Date.now()).format("YYYY-MM-DD")
             let save = await helpers.save(req.body, registrationModel);
             //mail send

            const transporter = nodemailer.createTransport({
                service: process.env.SERVICE,
                auth: {
                    user:  process.env.USER_EMAIL,
                    pass:  process.env.PASSWORD_EMAIL,
                },
              });
              
              var html = fs.readFileSync(path.join(__dirname, '../../public/templates') + '/email_verification_code.html', 'utf8');
              contents2 = await html.replace("{{Title}}","Congratulations!, you are a member of NUGO.");
              // Define the email options
              const mailOptions = {
                from:  process.env.USER_EMAIL,
                to:   req.body.email,
                subject: 'NUGO Registration',
                html: contents2,
              };
              
              // Send the email
              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.log('Error occurred:');
                  console.log(error.message);
                } else {
                  console.log('Email sent successfully!');
                  return res.status(201).json({status:"User Created Successfully, Please check your email"})
                }
              });
            
             
        }catch (error) {
             console.log(error)
             res.status(500).send({message:error})
         } 
    },
    getUser : async function(req,res){
        try{
            if(!req.params.id){
                return res.status(400).json({
                      error: "Missing Field",
              })
            }
             let user = await helpers.findOne(null, {id:req.params.id}, null, null, null, null, null, registrationModel)
             return res.status(200).json({user:user})
        }catch (error) {
             console.log(error)
             res.status(500).send({message:error})
         } 
    },
    updateUser : async function(req,res){
        try{
            if(!req.body.id || !req.body.name ||!req.body.email || !req.body.address || !req.body.city || !req.body.country){
                return res.status(400).json({
                      error: "Missing Field",
              })
            }
            let user = await helpers.findOne(null, {id:req.body.id}, null, null, null, null, null, registrationModel)
            if(user == null){
                return res.status(403).json({error:"Please check ID, This ID not found"})
             }
            if(user.dataValues.email==req.body.email){
                let data = {
                    name:req.body.name,
                    address: req.body.address,
                    city: req.body.city,
                    country: req.body.country,
                    
                };
                let update = await registrationModel.update(data, { where: { id:req.body.id} })
                return res.status(200).json({status:"Updated Successfully"})
            }
            if(user.dataValues.email!=req.body.email){

                let email = await helpers.findOne(null,{email:req.body.email}, null, null, null, null, null, registrationModel);
                if(email != null){
                    return res.status(403).json({error:"This Email already added"})
                 }
                let data = {
                    name:req.body.name,
                    email:req.body.email,
                    address: req.body.address,
                    city: req.body.city,
                    country: req.body.country,
                    
                };
                let update = await registrationModel.update(data, { where: { id:req.body.id} })
                return res.status(200).json({status:"Updated Successfully"})
            }
           
           
        }catch (error) {
             console.log(error)
             res.status(500).send({message:error})
         } 
    },
    deleteUser :async function(req,res){
        try{
           if(!req.params.id ){
               return res.status(400).json({
                     error: "Missing Required ID",
             })
           }
   
           let delete_user =await helpers.deleteUser(req.params.id, registrationModel);
           return res.status(200).json({status:"User has been deleted"})
        }catch (error) {
        console.log(error)
        res.status(500).send({message:error})
    } 
    },
}