// Recuperation de l'id du produit contenu dans l'URL sous la forme de variable "productID"
const productID = new URL(window.location.href).searchParams.get("id");
console.log(productID)

// Constructeur fonction pour retourner les data du produit lie a l'ID
async function getProduct(identifiant_produit){
    let productList = await fetch(`http://localhost:3000/api/products/${identifiant_produit}`);
    return productList.json();
}

// Fonction avec le parametre "productID", qui renvoie une promesse "product" qui contient productlist.json
// et l'injecte dans le DOM
getProduct(productID)
.then(product => {

    //check up des data dans la console
    console.log(product);

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



