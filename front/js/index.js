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
    }
    items.innerHTML = out;
})
// Checking fetch error
.catch ((error) =>{
    console.log (error);
});
