const form =
document.getElementById("signupform");

form.addEventListener("submit" , function(event) {
    event.preventDefault();

    const bussinessname =
    document.getElementById("bussinessname").value;
    const ownername =
    document.getElementById("ownername").value;
    const email =
    document.getElementById("email").value;
    const phone =
    document.getElementById("phone").value;
    const password =
    document.getElementById("password").value;
    const confirmpassword =
    document.getElementById("confirmpassword").value;
    const passwordError =
    document.getElementById("passwordError");
    const terms = 
    document.getElementById("terms").checked;
    const passwordError1 =
    document.getElementById("passwordError1");
     passwordError1.textContent = "";
     
    if(password !== confirmpassword){
        passwordError.textContent = "password doesnot match";
        return;
    }

    


   

    fetch("http://localhost:3000/signup" , {
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },

        body : JSON.stringify({
            bussinessname,
            ownername,
            email,
            phone,
            password,
            
            terms : "agreed"

        })
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
       
        window.location.href = "dashboard.html";
        
        
        
    })
    .catch(error => {
        console.log("ERROR:" , error);
    });
});