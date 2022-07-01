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
          totalQuantity(basket);
          totalQuantity (basket);
          totalPrice(basket);

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
              basket[foundIndex].quantity = 100;
              window.confirm(`Vous ne pouvez commander qu'une quantite maximum de 100 par produit et couleur`)
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
    quantity = basket[i].quantity;
    getProduct(basket[i].id)
    .then (product =>{
    totalPrice += product.price*quantity;
    // Injection into HTML
    document.querySelector("#totalPrice").innerHTML = totalPrice;
  }
)}
}

let basket = getBasket();
displayBasket(basket);

//////////////
//Order form//
//////////////

let emailRegExp = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$');
let charRegExp = new RegExp("^[a-zA-Z ,.'-]+$");
let addressRegExp = new RegExp("^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+");

function getForm (){
  firstName.addEventListener('change', ()=>{
    inputCheck(firstName,charRegExp,firstNameErrorMsg);
  })
  lastName.addEventListener('change', ()=>{
    inputCheck(lastName,charRegExp,lastNameErrorMsg);
  })
  address.addEventListener('change', ()=>{
    inputCheck(address,addressRegExp,addressErrorMsg);
  })
  city.addEventListener('change', ()=>{
    inputCheck(city,charRegExp,cityErrorMsg);
  })
  email.addEventListener('change', ()=>{
    inputCheck(email,emailRegExp,emailErrorMsg);
  })
}

function inputCheck(input,regExp,errorMsg){
  if(regExp.test(input.value)){
    errorMsg.innerHTML = '';
  } else {
    errorMsg.innerHTML = 'Veuillez renseigner ce champ correctement';
  }
}

getForm();