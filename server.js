require("dotenv").config();
/*
console.log("JWT SECRET LOADED:", !!process.env.JWT_SECRET);
console.log("JWT SECRET LENGTH:", process.env.JWT_SECRET?.length);
*/
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { MongoClient } = require("mongodb");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./utils/authmiddleware");

console.log("AUTH MIDDLEWARE:", authMiddleware);
console.log("TYPE:", typeof authMiddleware);


const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

const client = new MongoClient(process.env.MONGODB_URI);

let merchants;
let customers;

async function connectdb() {
   try{
      await client.connect();

      const db = client.db("PAYFLOW");
        merchants = db.collection("merchants");
        customers = db.collection("customers");

        console.log("Mongodb connected successfully");

        const PORT = process.env.PORT || 3000;

        app.listen(PORT , () => {
            console.log(`server is running on ${PORT}`);
        });
   }catch (error) {
        console.error("MongoDB connection failed:", error);
    };
};

app.post("/signup" , async(req,res) => {

    try {
    const {bussinessname , ownername , email , phone , password  } = req.body;

    const Existinguser = await merchants.findOne({PHONE : phone , EMAIL : email});
    if(Existinguser){
        return res.status(200).json({
            message : "merchant already exists"
        });
    }

    const hashedpassword = await bcrypt.hash(password , 10);

    await merchants.insertOne({
        merchantId : "mer" + crypto.randomBytes(8).toString("hex"),
       BUSSINESSNAME : bussinessname,
       OWNERNAME : ownername,
       EMAIL : email,
       PHONE : phone,
      password : hashedpassword


    });
    return res.status(200).json({
        successs : true,
        message : "account created successfully"
    });
}catch (error) {
    console.error("signup error:", error);

    return res.status(500).json({
        message : "Internal server error"
    });
}
});


connectdb();
app.post("/login" , async(req,res) => {
    const {email , password} = req.body;

    const user = await merchants.findOne({ EMAIL : email});
     if(!user){
        return res.status(501).json({
            message : "invalid email or password"
        })
     }
     const isMatch = await bcrypt.compare( password , user.password);
     if(!isMatch){
        return res.status(501).json({
            success : false,
            message : "invalid email or password"
        });
     }

     const token = jwt.sign(
        {
              merchantId : user.merchantId,
              ownername : user.OWNERNAME
        },
        process.env.JWT_SECRET,
        {
            expiresIn : "1h"
        }
     );
     
     return res.status(200).json({
        success : true,
        message : "LOGIN SUCCESSFUL",
        token : token,
        merchant : {
          merchantId :  user.merchantId,
          bussinessname : user.BUSSINESSNAME,
          email : user.EMAIL,
          ownername : user.OWNERNAME,
          phone : user.PHONE
          
                  
        }
     });
    
})

app.get("/merchants" , authMiddleware , (req,res) => {
    console.log(req.user);

    res.json({
        message : "Authorization successful",
        user : req.user
    });
});

app.post("/Customers" , authMiddleware ,  async(req,res) => {
    const merchantId = req.user.merchantId;
    console.log(merchantId);
    const {CustomerName , Amount , OrderId , Description} = req.body;
    console.log(CustomerName , Amount , OrderId , Description);

    

   const customerData = {
        merchantId : merchantId,
        customerId : "cus_" + crypto.randomBytes(8).toString("hex"),
        customername : CustomerName,
        amount : Amount,
        orderId : OrderId,
        description : Description

    };

    console.log(customerData);

    await customers.insertOne(customerData);

  
       return res.status(200).json({
        message : "Payment Request sent to the customer",
        customer : customerData
       
        
    });
});

app.get("/Customers" , authMiddleware , async(req,res) => {
    
    const merchantId = req.user.merchantId;

    const customerData = await customers.find({
        merchantId : merchantId
    }).toArray();

    return res.status(200).json({
        customerData
    });
});