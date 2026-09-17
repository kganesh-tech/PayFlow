const form = 
document.getElementById("loginform");

form.addEventListener("submit" , function(event) {
    event.preventDefault();

    const email = 
    document.getElementById("email").value;
    const password =
    document.getElementById("password").value;
    const passwordError =
    document.getElementById("passwordError");

    
    

    passwordError.textContent = "";
    const remember =
    document.getElementById("remember").checked;

    const passwordError1 =
    document.getElementById("passwordError1");

    passwordError1.textContent ="";

    fetch("https://payflow-1-kh51.onrender.com/login" , {
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },

        body : JSON.stringify({
            email,
            password
        })

    })

    .then(res => res.json())
    .then(data => {
        alert(data.message);
        console.log("TOKEN RECEIVED" , data.token);
        console.log("MERCHANT DETAILS", data.merchant);
        
        if(data.success == true){
            passwordError1.textContent = data.message;
             localStorage.setItem("token" , data.token);
             localStorage.setItem("merchant", JSON.stringify(data.merchant));
            window.location.href = "dashboard.html";
        }
    })
})