const order = new URL(window.location.href).searchParams.get("orderId");
orderId.innerHTML = order;

// recuperer avec searchParam