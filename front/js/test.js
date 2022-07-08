//PARAMETRES GLOBAUX
let urlAPI = 'http://localhost:3000/api';

//récupération du contenu du panier dans le LocalStorage
function getCartFromLS() {
  let cart = localStorage.getItem("product");
  if (cart === 0 || cart === null) {
    return [];
  } else {
    return JSON.parse(cart);
  }
}
//Enregsitrement du contenu du panier dans le LocalStorage
const saveCartInLS = (cartContent) => {
  localStorage.setItem("product", JSON.stringify(cartContent)); 
}

//récupération des infos d'un produit depuis l'API
//fetch, donc fonction asynchrone
async function getProductInfo(productId) {
  return fetch(`${urlAPI}/products/${productId}`)
  .then(res =>  {return res.json()})
  .then(response => { return response}) 
  .catch((err) => { console.log("erreur",err) })
}

//gestion de la modification des produits dans le panier
const updateQuantities = () => {
  let itemsQuantity = document.querySelectorAll(".itemQuantity");
  itemsQuantity.forEach((itemquantity) => {
    itemquantity.addEventListener("change", (event) => {
      event.preventDefault();
      // on récupère les éléments qui permettront la mise à jour
      const inputValue = itemquantity.value;
      const dataId = itemquantity.closest("article").dataset.id;
      const dataColor = itemquantity.closest("article").dataset.color;
      //on récupère le contenu du localStorage
      let productsInCart = getCartFromLS();
      //On le parcourt
      productsInCart.forEach((productInCart) => {
        if (productInCart.id == dataId && productInCart.color == dataColor) {
          if(inputValue < 1 || inputValue > 100) {
            //on réinitialise la valeur du champ itequantity à a valeur présent dans le local Storage
            itemquantity.value = productInCart.quantity;
            //on prévient l'utilisateur
            alert('Attention, quantité saisie invalide.');
          } else {
            //on met à jour le localStorage
            productInCart.quantity = inputValue;
            alert('Produit mis à jour');
          }
        }
      });
      console.log(productsInCart);
      // Mise à jour du localStorage
      saveCartInLS(productsInCart);
      //On recalcul les totaux du panier
      cartTotals();
      
    });
  });
};

//calcul du nombre total de produit + du prix total du panier
const cartTotals = () => {
  let nbproducts = 0;
  let totalCart = 0;
  let productsInCart = getCartFromLS();
  if (productsInCart.length == 0) {
    totalQuantity.innerHTML = nbproducts;
    totalPrice.innerHTML = totalCart;
    } else {
    productsInCart.forEach(async (productInCart) => {
      const productInfo = await getProductInfo(productInCart.id);
      nbproducts += parseInt(productInCart.quantity);
      totalCart += parseInt(productInfo.price)*parseInt(productInCart.quantity);
      totalQuantity.innerHTML = nbproducts;
      totalPrice.innerHTML = totalCart;
    });
  }
}

//fonction de gestion de la suppression d'un produit dans le panier
const deleteProducts = () => {
  //on récupère tous les liens de suppression des produits du panier
  let deletedProductLinks = document.querySelectorAll(".deleteItem");
  deletedProductLinks.forEach((deletedProductLink) => {
    //pour chacun d'entre eux, on créé un écouteur d'événement pour agir quand on va cliquer dessus
    deletedProductLink.addEventListener("click", (event) => {
      //on récupère le couple ID + coloris du produit que l'on va devoir supprimer
      console.log(
        "suppression de produit ID",
        deletedProductLink.closest("article").dataset.id,
        "coloris",
        deletedProductLink.closest("article").dataset.color
      );

      let deleteId = deletedProductLink.closest("article").dataset.id;
      let deleteColor = deletedProductLink.closest("article").dataset.color;

      let productsInCart = getCartFromLS();
      productsInCart = productsInCart.filter(
        (element) => !(element.id == deleteId && element.color == deleteColor)
      );

      // Mise à jour du local storage avec les produits restants
      // Traduction de l'objet javascript en chaine de caractère JSON
      saveCartInLS(productsInCart);

      // Confirmation de la suppression du produit
      alert("Votre article a bien été supprimé de votre panier !");

      // Rechargement de la page pour actualiser le contenu du panier
      displayCart();
    });
  });
};

function displayCart() {
  //on vide au préalable ce que contient le conteneur du panier
  cart__items.innerHTML = "";
  //on récupère le contenu du panier depuis le LS
  let productsInCart = getCartFromLS();
  //on affiche un message si le panier est vide
  if (productsInCart.length == 0) {
    cart__items.innerHTML +=
      '<p style="text-align:center">Votre panier est vide ! Remplissez-le dès maintenant en <a href="index.html">parcourant notre catalogue.</p>';
  } else {
    //on parcourt le LS, renyant une fonction asynchrone qui va appeler via un await les infos du produit
    //ceci pour que productInfo ne contienne plus une promesse, mais bien le tableau des infos du produit.
    productsInCart.forEach(async (productInCart) => {
      const productInfo = await getProductInfo(productInCart.id);
      //console.log(productInCart.id,productInfo._id,productInfo.name);
      //creation d'un élément article dans le panier
      productsCart = `<article class="cart__item" data-id="${productInCart.id}" data-color="${productInCart.color}">         
                    <div class="cart__item__img">
                        <img src="${productInfo.imageUrl}" alt="${productInfo.altText}">
                    </div>
                    <div class="cart__item__content">
                        <div class="cart__item__content__titlePrice">
                            <h2>${productInfo.name}</h2>
                            <p>${productInCart.color}</p>
                            <p>${productInfo.price} €</p>
                        </div>          
                        <div class="cart__item__content__settings">
                            <div class="cart__item__content__settings__quantity">
                                <p>Qté : </p>
                                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productInCart.quantity}">
                            </div>
                            <div class="cart__item__content__settings__delete">
                                <p class="deleteItem">Supprimer</p>
                            </div>
                        </div>
                    </div>
                </article>`;

      cart__items.innerHTML += productsCart;
      //activation des boutons de mise à jour des quantités dans le panier
      updateQuantities();
      //activation des boutons de suppression dans le panier
      deleteProducts();
     
    });
  }
  //calcul des totaux du panier
  cartTotals();
}
//et enfin, on lance l'affichage du panier !
displayCart();