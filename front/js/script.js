// fetch + recuperer le Json
async function getProducts(){
       let productList = await fetch("http://localhost:3000/api/products");
       return productList.json();
   }

// Fonction principale pour afficher les articles
async function productList() {
    let productList = await getProducts()
    .then((product) =>{

    //Trouver la section produit dans le dom
        const productSection = document.querySelector('#items');

    // Boucle de creation
    for (let i=0; i < product.length; i++) {

        // Creation element lien
        let productLink = document.createElement('a');
        productSection.appendChild(productLink);
        productLink.href = '#';

        // Creation element Article
        let productArticle = document.createElement('article');
        productLink.appendChild(productArticle);

        // creation element image
        let productImg = document.createElement('img');
        productArticle.appendChild(productImg);
        productImg.classList.add('productImg');
        productImg.src = product[i].imageUrl;
        productImg.alt = product[i].altTxt;

        // Creation element nom
        let productName = document.createElement('h3');
        productArticle.appendChild(productName);
        productName.classList.add('productName');
        productName.innerHTML = product[i].name;

        // Creation element description
        let productDescription = document.createElement('p');
        productArticle.appendChild(productDescription);
        productDescription.classList.add('productDescription');
        productDescription.innerHTML = product[i].description;
        }
   });
}

productList();

