var shoppingCart = JSON.parse(localStorage.getItem('carrito')) || [];
let cartContent = document.getElementById('offcanvasBody');
let totalPriceContainer = document.getElementById('totalPrice');

function totalCarrito() {
    const total = shoppingCart.reduce((acc, el) => acc + parseFloat(el.precio) * el.cantidad, 0);
    
    if (total === 0) {
        totalPriceContainer.innerHTML = '';
    } else {
        totalPriceContainer.innerHTML = `
        <div class="d-flex justify-content-evenly align-items-center mt-3 mb-3">
            <p class="text-center fw-bold text-success m-0">Total: $${total.toFixed(2)}</p>
            <button type="button" class="btn btn-success" onclick="finCompra('${total}')">Finalizar compra</button>
        </div>`;
    }
}

function agregarAlCarrito(id, precio, nombre, imagen, stock, cantidad) {
    //Creamos el objeto con los parametros que recibe la funcion
    let producto = {
        id: id,
        precio: precio,
        nombre: nombre,
        imagen: imagen,
        stock: stock,
        cantidad: cantidad
    }
    //Se añade al carrito el objeto
    const productInCart = shoppingCart.find(existing => existing.id === producto.id);
    if (productInCart) {
        shoppingCart.map(existing => {
            if (existing.id === producto.id) {
                existing.cantidad++;
            }
        });
    } else {
        shoppingCart.push(producto);
    }
    alert('Producto agregado al carrito');    

    saveLocalStorage();
}

function restar(id, precio) {
    shoppingCart.find(existing => {
        if (existing.id === id) {
            existing.cantidad--;
            if (existing.cantidad === 0) {
                eliminarProducto(id);
            }
        }
    });
    saveLocalStorage();
    actualizarCarritoDOM();
}

function sumar(id, precio, stock) {
    shoppingCart.find(existing => {
        if (existing.id === id) {
            if (existing.cantidad < stock) {
                existing.cantidad++;
            } else {
                alert('No hay más stock disponible');
            }
        }
    });
    saveLocalStorage();
    actualizarCarritoDOM();
}

function saveLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(shoppingCart));
}

function eliminarProducto(id) {
    //Eliminar del carrito
    shoppingCart = shoppingCart.filter(producto => producto.id != id);
    //Eliminar del DOM
    let productDetail = document.getElementById(id);
    productDetail.remove();

    totalCarrito();
    saveLocalStorage();
}

function actualizarCarritoDOM() {
    // Limpiar el contenido del carrito antes de actualizarlo
    cartContent.innerHTML = '';

    shoppingCart.forEach(producto => {
        let productDetail = document.createElement('div');
        productDetail.setAttribute('id', producto.id);
        productDetail.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'mb-3');
        productDetail.innerHTML = `
        <div class="d-flex align-items-center">
            <img src="${producto.imagen}${producto.nombre}" class="imagenCarrito rounded">
            <div>
                <div class="d-flex justify-content-center flex-column align-items-center">
                    <p class="m-0 fw-bold">${producto.nombre}</p>
                    <p class="m-0 fw-bold text-success">$${(producto.precio * producto.cantidad).toFixed(2)}</p>
                </div>    
                <div class="d-flex flex-column justify-content-center align-items-center">
                    <div class="d-flex justify-content-between align-items-center ms-4 me-4">
                        <button class="btn restar" onclick="restar('${producto.id}', '${producto.precio}')">-</button>
                            <input class="m-1 form-control form-control-xs text-center" readonly value="${producto.cantidad}"></input>
                        <button class="btn sumar" onclick="sumar('${producto.id}', '${producto.precio}', '${producto.stock}')">+</button>
                        </div>
                </div>
            </div>
        </div>
        <button class="btn btn-danger" onclick="eliminarProducto('${producto.id}')"><i class="bi bi-trash"></i></button>
    `;
        cartContent.appendChild(productDetail);
    });
    totalCarrito();
}

function verDetalles(id, precio, nombre, imagen, descripcion, stock) {
    let details = document.getElementById('details');
    details.innerHTML = `
    <div class="d-flex justify-content-center w-50">
        <img src="${imagen}${nombre}" class="rounded img-fluid object-fit-cover">
    </div>
    <div class="d-flex flex-column justify-content-center align-items-center w-50 m-3">
        <p class="fw-bold text-center">${nombre}</p>
        <p class="text-center">${descripcion}</p>
        <p class="text-center fw-bold text-success">$${precio}</p>
        <div class="btn-group btn-group-toggle mt-3" data-toggle="buttons">
            <label class="btn btn-outline-secondary">
            <input type="radio" name="talla" autocomplete="off"> S
            </label>
            <label class="btn btn-outline-secondary">
            <input type="radio" name="talla" autocomplete="off"> M
            </label>
            <label class="btn btn-outline-secondary">
            <input type="radio" name="talla" autocomplete="off"> L
            </label>
            <label class="btn btn-outline-secondary">
            <input type="radio" name="talla" autocomplete="off"> XL
            </label>
        </div>
    </div>
    `;

    let footer = document.getElementById('modalFooter');
    footer.innerHTML = `
    <button type="button" class="btn btn-primary" onclick="agregarAlCarrito('${id}', '${precio}', '${nombre}', '${imagen}', '${stock}', 1)">Agregar al Carrito</button>
    <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>
    `;
}

function finCompra(total) {
    alert(`Pago por $${total} realizado con éxito`);
    localStorage.clear();
    location.reload();
}
