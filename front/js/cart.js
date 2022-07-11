let basket = getBasket();

//////////////////////
//Display the basket//
//////////////////////

//  Request the API product using his ID and returns it in JSON format
async function getProduct(identifiant_produit){
    let productList = await fetch(`http://localhost:3000/api/products/${identifiant_produit}`);
    return productList.json();
}

// Get the actual localStorage data (Key: basket)
function getBasket() {
  // Store the data in basket
  let basket = localStorage.getItem("basket");
  if (basket == null) {
      // Create new empty array if the local storage (Key: basket) is non-existent
      return [];
  } else {
      // Convert the string into JSON format
      return JSON.parse(basket);
  }
}

// Save the parameter "basket" in the localStorage (Key: basket)
function saveBasket(basket) {
  // Store the data as a string
  localStorage.setItem("basket", JSON.stringify(basket));
} 

// Injecting function for the html content witht the localStorage data (Key: basket)
function displayBasket(basket) {
  basket = getBasket();
  // Initializing empty variable
  let out = "";
  // Injecting loop for the HTML content with the localStorage data (Key: basket)
  for (let i=0; i < basket.length; i++) {
      // Get aditionnal data from API 
      getProduct(basket[i].id)
      .then (product => {
          out += `<article class="cart__item" data-id="${basket[i].id}" data-color="${basket[i].color}">
          <div class="cart__item__img">
            <img src="${product.imageUrl}" alt="${product.altTxt}">
            </div>
          <div class="cart__item__content">
            <div class="cart__item__content__description">
              <h2>${product.name}</h2>
              <p>${basket[i].color}</p>
              <p>${product.price} €</p>
            </div>
             <div class="cart__item__content__settings">
              <div class="cart__item__content__settings__quantity">
                <p>Qté : </p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${basket[i].quantity}">
              </div>
              <div class="cart__item__content__settings__delete">
                <p class="deleteItem">Supprimer</p>
              </div>
            </div>
          </div>
        </article>`;
        cart__items.innerHTML = out;

        ///////////////////////////
        //Fonction changeQuantity//
        ///////////////////////////

        // Initializing HTML collection in a variable
        let quantityCollection = document.getElementsByClassName("itemQuantity");

        // addEventListerner loop for the entire collection
        for (i=0; i < quantityCollection.length; i++){
        // Quantities modifier function
          quantityCollection[i].addEventListener("change", function changeQuantity(){
          // add some variable to compare and find which product we talk about
          let productID = this.closest("article").dataset.id;
          let productColor = this.closest("article").dataset.color;
          let foundIndex = basket.findIndex(p => (p.id == productID) && (p.color == productColor));
          // Modifying the quantity if it different from the actual basket
          if ((basket[foundIndex].quantity != this.value) && (this.value >=1 && this.value <100)){
            basket[foundIndex].quantity = this.value;
          // Adding some condition is the customer wants more than 100 products of the same ID/Color Combinaison
          } else {
            this.value = 100;
            basket[foundIndex].quantity = 100;
            window.alert(`Vous ne pouvez commander qu'une quantite maximum de 100 par produit et couleur`)
            }
          // Store the modified quantity to the local storal (Key: basket)
          saveBasket(basket);
          totalQuantity(basket);
          totalPrice(basket);
        });
        }
        //////////////////////////
        //Fonction deleteProduct//
        //////////////////////////

        // addEventListerner loop for the entire collection
        let deleteCollection = document.getElementsByClassName("deleteItem");
        // addEventListerner loop for the entire collection
        for (i=0; i<deleteCollection.length; i++){
          deleteCollection[i].addEventListener("click", function deleteproduct (){
          // add some variable to compare and find which product we talk about
          let productID = this.closest("article").dataset.id;
          let productColor = this.closest("article").dataset.color;
          let foundIndex = basket.findIndex(p => (p.id == productID) && (p.color == productColor));
          // Delete the product via it index
          basket.splice(foundIndex, 1);
          // Store this new basket to the local storal (Key: basket)
          saveBasket(basket);
          // Refresh the display basket
          displayBasket(basket);
          })
        }
      })
  }
  totalQuantity (basket);
  totalPrice(basket);
}

// Function to calculate the total quantity and inject it into the html
function totalQuantity (basket){
  // Initializing empty variable
  let totalQuantity = 0;
  // Calculation loop
  for (i=0; i<basket.length;i++){
  totalQuantity += Number(basket[i].quantity);
  }
  // Injection into HTML
  document.querySelector("#totalQuantity").innerHTML = totalQuantity;
}

// Function to calculate the total price and inject it into the html
function totalPrice (basket){
  // Initializing empty variable
  let totalPrice = 0;
  // Calculation loop
  for (i=0; i<basket.length;i++){
    let quantity = basket[i].quantity;
    getProduct(basket[i].id)
    .then (product =>{
    totalPrice += Number(product.price)*Number(quantity);
    // Injection into HTML
    document.querySelector("#totalPrice").innerHTML = totalPrice;
  }
)}
}

displayBasket(basket);

//////////////
//Order form//
//////////////

// variable to do the Regex checks
let emailRegExp = new RegExp('^[a-z0-9.-_]+[@]{1}[a-z0-9.-_]+[.]{1}[a-z]{2,10}$');
let charRegExp = new RegExp("^[a-zA-Z ,.'-]+$");
let addressRegExp = new RegExp("^[0-9]{1,5}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+");
let firstNameErr= false;
let lastNameErr= false;
let addressErr= false;
let cityErr= false;
let emailErr= false;

// Run the inputCheck function if the value is changed
firstName.addEventListener('change', ()=>{
  inputCheck(firstName,charRegExp,firstNameErrorMsg," (exemple: Jean)");
  if (firstNameErrorMsg.innerHTML != ''){
    firstNameErr= true;
  } else {
    firstNameErr= false;
  }
})
lastName.addEventListener('change', ()=>{
  inputCheck(lastName,charRegExp,lastNameErrorMsg," (exemple: Dupont)");
  if (lastNameErrorMsg.innerHTML != ''){
    lastNameErr= true;
  } else {
    lastNameErr= false;
  }
})
address.addEventListener('change', ()=>{
  inputCheck(address,addressRegExp,addressErrorMsg," (exemple: 23 de la rue de la Douane)");
  if (addressErrorMsg.innerHTML != ''){
    addressErr= true;
  } else {
    addressErr= false;
  }
})
city.addEventListener('change', ()=>{
  inputCheck(city,charRegExp,cityErrorMsg," (exemple: Paris)");
  if (cityErrorMsg.innerHTML != ''){
    cityErr= true;
  } else {
    cityNameErr= false;
  }
})
email.addEventListener('change', ()=>{
  inputCheck(email,emailRegExp,emailErrorMsg," (exemple: jean.dupont@gmail.com)");
  if (emailErrorMsg.innerHTML != ''){
    emailNameErr= true;
  } else {
    emailNameErr= false;
  }
})

// This function is used to check Regex with several parameters
function inputCheck(input,regExp,errorMsg,msg){
  if(regExp.test(input.value)){
    errorMsg.innerHTML = '';
  } else {
    errorMsg.innerHTML = 'Veuillez renseigner ce champ correctement' + msg;
  }
}

// Here we will define the sending of data to the API when clicking on the order button and under certain conditions
order.addEventListener('click', (event)=>{
  event.preventDefault();
  // checking if all of input data are correct
  if(firstNameErr == false && lastNameErr == false && addressErr == false && cityErr == false && emailErr == false && basket.length != 0) {
    // create empty array
    let productIDArray = [];
    // Get all ID in the basket to the new Array
    for(let i=0; i<basket.length;i++){
      productIDArray.push(basket[i].id);
    }
    // Get all the input data about the customer
    let productOrder = {
      contact : {
        "firstName": firstName.value,
        "lastName": lastName.value,
        "address": address.value,
        "city": city.value,
        "email": email.value,
      },
      "products": productIDArray,
    };
    //Post it to the API
    fetch('http://localhost:3000/api/products/order', {
    method: 'POST',
    headers: {
      // This si the content type for JSON sending
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(productOrder)
    })
    // get the promise as JSON format
    .then((response) => response.json())
    // Transform the reponse in URL
    .then ((data) => {
    document.location.href = `confirmation.html?orderId=${data.orderId}`;
    })
    .catch (err => {
      console.log("Erreur postForm");
    });
  }
})