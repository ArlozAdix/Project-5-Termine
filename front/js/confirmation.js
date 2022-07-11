// Get the order ID without localStorage
const order = new URL(window.location.href).searchParams.get("orderId");
orderId.innerHTML = order;
// Clear the localStorage
localStorage.clear();