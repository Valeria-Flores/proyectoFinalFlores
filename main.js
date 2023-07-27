/* Productos */
class Producto{
    constructor(id,nombre, descripcion,precio,imagen,cantidad){
        this.id=parseInt(id);
        this.nombre=nombre;
        this.descripcion=descripcion;
        this.precio=parseFloat(precio);
        this.imagen = imagen;
        this.cantidad=parseInt(cantidad);
    }

}

/* Petición */
const cargarCatalogo = async () =>{
   const res = await fetch("muebles.json");
   const data = await res.json();
   for(let mueble of data){
      let nProducto = new Producto(mueble.id, mueble.nombre, mueble.descripcion, mueble.precio, mueble.imagen, mueble.cantidad);
      productos.push(nProducto);
   }
   console.log(productos);
   localStorage.setItem("productos", JSON.stringify(productos));
}

/* Array del catalogo */
let productos = []; 
 
// Añadir productos al catalogo
if(localStorage.getItem("productos")){
    productos = JSON.parse(localStorage.getItem("productos"));
}else{
    cargarCatalogo();
}
console.log(productos);

/* DOM */
let modalCarrito = document.getElementById("modalCarrito")
let btnCarrito = document.getElementById("btnCarrito")
let precio = document.getElementById("precio")
let orden = document.getElementById("orden")
let catalogoDiv = document.getElementById("muebles")


/* Carrito */
let productosCarrito;
if(localStorage.getItem("carrito")){
   productosCarrito = JSON.parse(localStorage.getItem("carrito"));
}else{
   productosCarrito = [];
   localStorage.setItem("carrito", productosCarrito);
}

function btnCatalogo(array){
    catalogoDiv.innerHTML = ``
   for(let producto of array ){
      let agregarProducto = document.createElement("div")
      agregarProducto.className = "col"
      agregarProducto.innerHTML = `<div id="${producto.id}" class="card tarjetas">
                                    <div align="center">
                                    <img class="card-img-top img-fluid imgCard" style="height: 250px; width:300px"src="assets/${producto.imagen}" alt="${producto.nombre}">
                                    </div>
                                    <div class="card-body">
                                       <h4 class="card-title">${producto.nombre}</h4>
                                       <p>${producto.descripcion}</p>
                                       <p>Precio: ${producto.precio}</p>
                                    <button id="agregarBtn${producto.id}" class="btn btn-outline-success btnAgregar">Agregar al carrito</button>
                                    </div>
                              </div>`
      catalogoDiv.appendChild(agregarProducto)

      let agregarBtn = document.getElementById(`agregarBtn${producto.id}`)
      agregarBtn.addEventListener("click", () => {
         añadirCarrito(producto)
      })
   }
 
 }
 btnCatalogo(productos);

/* Añadir elementos al carrito */
function añadirCarrito(producto){
   let productoAgregado = productosCarrito.find((elem)=>elem.id == producto.id);
    if(productoAgregado == undefined){
       productosCarrito.push(producto);
       localStorage.setItem("carrito", JSON.stringify(productosCarrito))
    }else{
       producto.cantidad+=1;
    }
 }

 function añadirProductos(array){
    modalCarrito.innerHTML = ``;
    array.forEach((muebleCarrito)=>{
       modalCarrito.innerHTML += `
       <div class="card mb-3" style="max-width: 540px;">
         <div class="row g-0 targetaCarrito" id ="muebleCarrito${muebleCarrito.id}">
                  <div class="col-md-4" align="center">
                     <img class="mg-fluid rounded-start imgCarrito" src="assets/${muebleCarrito.imagen}" height="150px">
                  </div>
                  <div class="col-md-8">
                     <div class="card-body">
                         <h5 class="card-title">${muebleCarrito.nombre}</h5>
                          <p class="card-text">$${muebleCarrito.precio}</p> 
                          <p class="card-text">Cantidad: ${muebleCarrito.cantidad}</p> 
                          <button class= "btn btnDelete" id="eliminarBtn${muebleCarrito.id}"><i class="fas fa-trash-alt"></i></button>
                     </div>
                  </div>    
             </div>
             </div>
       
    `
    
    })

    array.forEach((muebleCarrito)=>{
      document.getElementById(`eliminarBtn${muebleCarrito.id}`).addEventListener("click", () => {
         let mueble = document.getElementById(`muebleCarrito${muebleCarrito.id}`);
         mueble.remove();
         let eliminarProd = array.find((prod) => prod.id == muebleCarrito.id);
         let posicion = array.indexOf(eliminarProd);
         array.splice(posicion,1);
         localStorage.setItem("carrito", JSON.stringify(array))
      });
      precioTotal(array);
    })

    
 }

 function precioTotal(array){
    let subtotal = array.reduce((acc, muebleCarrito)=> acc + muebleCarrito.precio , 0);
    let iva=subtotal*.16;
    let total=subtotal+iva;
    total == 0 ? precio.innerHTML= `No hay productos en el carrito` : precio.innerHTML = `El total es <strong>${total}</strong>`
 
 }

 btnCarrito.addEventListener("click", () => {
   añadirProductos(productosCarrito);
 })

 /* Orden */
 function ordenMenor(array){
    const menorMayor = [].concat(array)
    menorMayor.sort((a,b) => a.precio - b.precio)
    btnCatalogo(menorMayor)
  }
  
  function ordenMayor(array){
    const mayorMenor = [].concat(array)
    mayorMenor.sort((elem1 ,elem2) => elem2.precio - elem1.precio)
    btnCatalogo(mayorMenor)
  }
  orden.addEventListener("change", () => {
    switch(orden.value){
       case "1":
          ordenMayor(productos)
       break
       case "2":
         ordenMenor(productos)
       break
       default:
          btnCarrito(productos)
       break
    }
 });


