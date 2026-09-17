const token = localStorage.getItem("token");
const merchant = JSON.parse(localStorage.getItem("merchant"));

console.log(token);
console.log(merchant);

if (!token || !merchant) {
    window.location.href = "login.html";
}




const businessNames = document.querySelectorAll("#bussinessname");
const merchantIds = document.querySelectorAll("#merchantid");

businessNames.forEach(element => {
    element.textContent = merchant.bussinessname;
});

merchantIds.forEach(element => {
    element.textContent = "MID: " + merchant.merchantId;
});

document.getElementById("email").textContent = merchant.email;


const merchantProfile = document.getElementById("merchantProfile");
const profileDropdown = document.getElementById("profileDropdown");

merchantProfile.addEventListener("click", () => {
    profileDropdown.classList.toggle("active");
});


document.addEventListener("click", (event) => {

    if (
        !merchantProfile.contains(event.target) &&
        !profileDropdown.contains(event.target)
    ) {
        profileDropdown.classList.remove("active");
    }

});


fetch("https://payflow-1-kh51.onrender.com/merchants", {

    method: "GET",

    headers: {
        "Authorization": `Bearer ${token}`
    }

})
.then(res => res.json())
.then(data => {
    const merchantId = data.user.merchantId;
    console.log(merchantId);
});


const dashboardItems =
document.querySelector(".document-items");

document.getElementById("username").textContent = merchant.ownername;
document.getElementById("USERNAME").textContent = merchant.ownername;


const createPaymentRequest =
document.getElementById("createpaymentrequest");

const paymentModal =
document.getElementById("paymentModal");

const closeModal =
document.getElementById("closeModal");

const closeModalBtn =
document.getElementById("closeModalBtn");

const form =
document.getElementById("paymentRequestForm");
const dashboardsection =
document.getElementById("dashboardsection");


const customerLink =
document.getElementById("customerLink");


createPaymentRequest.addEventListener("click", function(event) {
    event.preventDefault();
    paymentModal.style.display = "flex";
});


closeModal.addEventListener("click", function(event) {
    event.preventDefault();
    paymentModal.style.display = "none";
});


closeModalBtn.addEventListener("click", function(event) {
    event.preventDefault();

    paymentModal.style.display = "none";
});


form.addEventListener("submit", function(event) {
    event.preventDefault();

    const CustomerName =
    document.getElementById("customerName").value;

    const Amount =
    document.getElementById("amount").value;

    const OrderId =
    document.getElementById("orderId").value;

    const Description =
    document.getElementById("description").value;


    const CustomerDetails = {
        CustomerName,
        Amount,
        OrderId,
        Description
    };


    console.log(CustomerDetails);


    fetch("https://payflow-1-kh51.onrender.com/Customers", {

        method: "POST",

        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },

        body: JSON.stringify(CustomerDetails)

    })

    .then(res => res.json())

    .then(data => {

        alert(data.message);

        console.log(data.customer);


        

         if (customerLink) {
        customerLink.addEventListener("click", function(event) {

            event.preventDefault();

            dashboardsection.classList.add("active");

        });
         }


        const customerSection =
        document.querySelector(".customer-requests");


        const message =
        document.createElement("p");


        message.classList.add("welcome-msg");

        message.textContent = "welcome";

        customerSection.appendChild(message);


        const customername =
        document.createElement("p");


        customername.classList.add("CustomerName");

        customername.textContent =
        data.customer.customername;


        const amount =
        document.createElement("p");


        amount.classList.add("amount-section");

        amount.textContent =
        data.customer.amount;


        customerSection.appendChild(customername);

        customerSection.appendChild(amount);

    })

    .catch(error => {

        console.log("ERROR:", error);

    });

});
