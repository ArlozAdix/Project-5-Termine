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

          ///////////////////////////
          //Fonction changeQuantity//
          ///////////////////////////

          // Initializing HTML collection in a variable
          let collection = document.getElementsByClassName("itemQuantity");

          // addEventListerner loop for the entire collection
          for (i=0; i < collection.length; i++){
          // Quantities modifier function
          collection[i].addEventListener("change", function changeQuantity(){
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
          });
          }
        })
    }
}

let basket = getBasket();
displayBasket(basket)




// bouton supprimmer
// mettre le prix total
// mettre quantite totale

// Test calcul quantite totale
// let totalProductQuantity = 0;
// totalProductQuantity += basket[i].quantity;
// totalQuantity.innerHTML = totalProductQuantity;
// console.log(totalProductQuantity);

// test change quantity
// let itemQuantity = document.querySelector(".itemQuantity")
// itemQuantity.addEventListener("change", () => {
// })