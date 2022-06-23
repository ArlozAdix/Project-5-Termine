//////////////////////////////////////
//Display all the available products//
//////////////////////////////////////

// Request the API product list and the returns it in JSON format
async function getProducts(){
       let productList = await fetch("http://localhost:3000/api/products");
       return productList.json();
   }

// call function to get data from API
getProducts()
// Make promise if the fetch is successfull
.then ((productList) => {
    // Initializing empty variable
    let out = "";
    // Injecting loop for the HTML content with the API data
    for (let product of productList) {
        out += `<a href="./product.html?id=${product._id}">
        <article>
          <img class="productImg" src="${product.imageUrl}" alt="${product.altTxt}">
          <h3 class="productName">${product.name}</h3>
          <p class="productDescription">${product.description}</p>
        </article>
      </a>`
      items.innerHTML = out;
    }
})
// Checking fetch error
.catch ((error) =>{
    console.log (error);
});

////////////////////////////
////////OLD VERSION/////////
////////////////////////////

// .then((product) =>{
//     // Boucle de creation
//     for (let i=0; i < product.length; i++) {

//         // Creation element lien
//         let productLink = document.createElement('a');
//         items.appendChild(productLink);
//         productLink.href = `product.html?id=${product[i]._id}`;

//         // Creation element Article
//         let productArticle = document.createElement('article');
//         productLink.appendChild(productArticle);

//         // creation element image
//         let productImg = document.createElement('img');
//         productArticle.appendChild(productImg);
//         productImg.classList.add('productImg');
//         productImg.src = product[i].imageUrl;
//         productImg.alt = product[i].altTxt;

//         // Creation element nom
//         let productName = document.createElement('h3');
//         productArticle.appendChild(productName);
//         productName.classList.add('productName');
//         productName.innerHTML = product[i].name;

//         // Creation element description
//         let productDescription = document.createElement('p');
//         productArticle.appendChild(productDescription);
//         productDescription.classList.add('productDescription');
//         productDescription.innerHTML = product[i].description;
//     }
// })
// // Console log en cas d'erreur de fetch
// .catch ((error) =>{
//     console.log (error);
// });
