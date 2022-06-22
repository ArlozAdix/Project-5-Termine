// Recuperation de l'id du produit contenu dans l'URL sous la forme de variable "productID"
const productID = new URL(window.location.href).searchParams.get("id");

// Constructeur fonction pour retourner les data du produit lie a l'ID
async function getProduct(identifiant_produit){
    let productList = await fetch(`http://localhost:3000/api/products/${identifiant_produit}`);
    return productList.json();
}

// Fonction avec le parametre "productID", qui renvoie une promesse "product" qui contient productlist.json
// et l'injecte dans le DOM
getProduct(productID)
.then(product => {

    // Creation element img depuis sa class item__img
    let productImg = document.createElement("img")
    document.querySelector(".item__img").appendChild(productImg);
    productImg.src = product.imageUrl;
    productImg.alt = product.altTxt;

    // Insertion du titre, prix et desciption directement via son id 
    title.innerHTML = product.name;
    price.innerHTML = product.price;
    description.innerHTML = product.description;

    //Boucle de creation d'options en fonction du nombre de couleurs disponibles
    for (let colors of product.colors){
        let productColors = document.createElement("option");
        document.querySelector("#colors").appendChild(productColors);
        productColors.value = colors;
        productColors.innerHTML = colors;
    }
})
// Console log en cas d'erreur de fetch
.catch ((error) => {
    console.log(error);
})



// Gestion du panier

//Fonction qui permet de sauvgarder le parametre basket dans le localStorage sous forme de string
function saveBasket(basket) {
    localStorage.setItem("basket", JSON.stringify(basket));
} 

//Fonction qui permet de retourner le panier sous forme JSON si existant, dans le cas contraire renvoie un tableau vide 
function getBasket() {
    let basket = localStorage.getItem("basket");
    if (basket == null) {
        return [];
    } else {
        return JSON.parse(basket);
    }
}

//Evenement sur le clic du bouton Ajouter au panier
addToCart.addEventListener("click", ()=>{
    // Definition de l'array du produit
    let product = {id:`${productID}`, color:`${colors.value}`, quantity:Number(`${quantity.value}`)};
    // Recuperation du localstorage
    let basket = getBasket();
    // Verifier si le produit/couleur existe deja
    let foundProduct = basket.find(p => (p.id == product.id) && (p.color == product.color));
    //Si l eproduit/couleur ets deja present, ajoute la quantite
    if(foundProduct != undefined){
    foundProduct.quantity = Number(foundProduct.quantity) + Number(`${quantity.value}`);
    // si inexistant, l'ajoute au local storage
    } else {
        basket.push(product);
    }
    // renvoi dans le localstorage
    saveBasket(basket);
})