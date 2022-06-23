////////////////////////////////
//Display the selected product//
////////////////////////////////

// Get the product ID with searchParam
const productID = new URL(window.location.href).searchParams.get("id");

// Request the API product using his ID and returns it in JSON format
async function getProduct(identifiant_produit){
    let product = await fetch(`http://localhost:3000/api/products/${identifiant_produit}`);
    return product.json();
}

// This function retrieves data via getProduct and inject them into the html
getProduct(productID)
.then (value => {
    // Initializing variable out with the actual content
    let out = colors.innerHTML;
    // Inject picture data
    document.querySelector(".item__img").innerHTML = `<img src="${value.imageUrl}" alt="${value.altTxt}"></img>`;
    // Inject name, price and description data
    title.innerHTML = value.name;
    price.innerHTML = value.price;
    description.innerHTML = value.description;
    // Loop used to inject mutiple colors data
    for (let productColors of value.colors){
        out += `<option value="${productColors}"> ${productColors} </option>`;
        colors.innerHTML = out;
    }
})
// Checking fetch errors
.catch (err => {
    console.log("Erreur getProduct");
})

////////////////////////////
////////OLD VERSION/////////
////////////////////////////

// getProduct(productID)
// .then(product => {

//     let productImg = document.createElement("img")
//     document.querySelector(".item__img").appendChild(productImg);
//     productImg.src = product.imageUrl;
//     productImg.alt = product.altTxt;

//     title.innerHTML = product.name;
//     price.innerHTML = product.price;
//     description.innerHTML = product.description;

//     for (let colors of product.colors){
//         let productColors = document.createElement("option");
//         document.querySelector("#colors").appendChild(productColors);
//         productColors.value = colors;
//         productColors.innerHTML = colors;
//     }
// })
// // Console log en cas d'erreur de fetch
// .catch ((error) => {
//     console.log(error);
// })

////////////////////
// Cart Management//
////////////////////

// Save the parameter "basket" in the localStorage (Key: basket)
function saveBasket(basket) {
    // Store the data as a string
    localStorage.setItem("basket", JSON.stringify(basket));
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

//Listening click event on the addToCart button
addToCart.addEventListener("click", ()=>{
    //Checking if quantity and colors have been chosen and valid
    if (quantity.value >= 1 && quantity.value <= 100 && colors.value != "") {
        // define the product array with ID, color and the quantity
        let product = {id:`${productID}`, color:`${colors.value}`, quantity:Number(`${quantity.value}`)};
        // Store the actual localStorage in the basket variable
        let basket = getBasket();
        // Checking if the ID/Color combinaison is already existing in the basket
        let foundProduct = basket.find(p => (p.id == product.id) && (p.color == product.color));
        if(foundProduct != undefined){
            // Checking if the basket does not exceed 100 products of the same combinaison (ID/color)
            if ( (Number(foundProduct.quantity) + Number(`${quantity.value}`)) <= 100 ){
                // If already existing and total < 100, add the new quantity to the old one
                foundProduct.quantity = Number(foundProduct.quantity) + Number(`${quantity.value}`);
            // blocks a maximum of 100 products and sends a notification
            } else {
                foundProduct.quantity = 100;
                window.confirm(`Vous ne pouvez commander qu'une quantite maximum de 100 par produit et couleur`)
            }
        // If the ID/color combinaison dosnt exist, push it in the basket variable
        } else {
            basket.push(product);
        }
        // Send a confirmation notification tot he custommer 
        window.confirm(`Votre commande  de ${quantity.value} ${title.innerHTML} ${colors.value} est ajoutee au panier`)
        // Store the new basket in the localStorage (Key: basket)
        saveBasket(basket);
    } else {
        // Send error notification if the quantity <=0 or >100 or the color has not been choosen
        window.confirm(`Veuillez choisir votre couleur et quantité avant de l'ajouter au panier`)
    }
})
