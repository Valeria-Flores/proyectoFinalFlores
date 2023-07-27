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

    // Añadir unidad
    añadir(){
      this.cantidad = this.cantidad + 1;
      return this.cantidad;
   }

   // Restar unidad
   restar(){
         this.cantidad = this.cantidad - 1;
         return this.cantidad;
   }
}

/* Petición carga de catalogo */
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

/* DOM */
let modalCarrito = document.getElementById("modalCarrito");
let btnCarrito = document.getElementById("btnCarrito");
let precio = document.getElementById("precio");
let orden = document.getElementById("orden");
let catalogoDiv = document.getElementById("muebles");
let btnFin = document.getElementById("btnFin");
let loader = document.getElementById("loader")
let loaderTexto = document.getElementById("loaderTexto")

/* Carrito */
let productosCarrito;
if(localStorage.getItem("carrito")){
   productosCarrito = JSON.parse(localStorage.getItem("carrito"));
}else{
   productosCarrito = [];
   localStorage.setItem("carrito", productosCarrito);
}
precioTotal(productosCarrito);

// Mostrar catalogo
function renderizarCatalogo(array){
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

/* Añadir elementos al carrito */
function añadirCarrito(producto){
   let productoAgregado = productosCarrito.find((elem)=>elem.id == producto.id);
    if(productoAgregado == undefined){
       productosCarrito.push(producto);
       localStorage.setItem("carrito", JSON.stringify(productosCarrito))
    }else{
      producto.cantidad+=1;
    }
    Toastify({
      text: "Producto agregado al carrito",
      duration: 1000,
      gravity: "bottom", 
      position: "right", 
      stopOnFocus: true, 
      style: {
        background: "linear-gradient(to right, #9CB8A2, #9CB8B0)",
      },
      onClick: function(){} 
    }).showToast();
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
                          <p class="card-text">Precio unitario $${muebleCarrito.precio}</p>
                          <button class= "btn btnMenos" id="btnBorrarU${muebleCarrito.id}"><i class=""></i>- 1</button>
                          <text class="card-text">Cantidad: <strong>${muebleCarrito.cantidad}</strong></text>
                          <button class= "btn btnMas" id="btnSumar${muebleCarrito.id}"><i class=""></i>+ 1</button> 
                          <p></p>
                          <p class="card-text">SubTotal: ${muebleCarrito.cantidad * muebleCarrito.precio}</p>   
                          <button class= "btn btnDelete" id="eliminarBtn${muebleCarrito.id}"><i class="fas fa-trash-alt"></i></button>
                     </div>
                  </div>    
             </div>
             </div>
    `
    })
    array.forEach((muebleCarrito)=>{
       // Sumar una unidad
       document.getElementById(`btnSumar${muebleCarrito.id}`).addEventListener("click", () =>{
         muebleCarrito.añadir()
         localStorage.setItem("carrito", JSON.stringify(array))
         añadirProductos(array)
      })

      // Restar una unidad
      document.getElementById(`btnBorrarU${muebleCarrito.id}`).addEventListener("click", ()=>{
         let cantProd = muebleCarrito.restar()
         if(cantProd < 1){
            let cardProducto = document.getElementById(`muebleCarrito${muebleCarrito.id}`)
            cardProducto.remove()
            let productoEliminar = array.find((mueble) => mueble.id == muebleCarrito.id)
            let posicion = array.indexOf(productoEliminar)
            array.splice(posicion,1)
            localStorage.setItem("carrito", JSON.stringify(array))
            precioTotal(array)
            }
            else{
                localStorage.setItem("carrito", JSON.stringify(array))
            }
         
         añadirProductos(array)
      })

      // Eliminar todo el producto
      document.getElementById(`eliminarBtn${muebleCarrito.id}`).addEventListener("click", () => {
         let mueble = document.getElementById(`muebleCarrito${muebleCarrito.id}`);
         mueble.remove();
         let eliminarProd = array.find((prod) => prod.id == muebleCarrito.id);
         let posicion = array.indexOf(eliminarProd);
         array.splice(posicion,1);
         localStorage.setItem("carrito", JSON.stringify(array))
         precioTotal(array);
         Toastify({
            text: "Producto eliminado",
            duration: 1000,
            gravity: "bottom", 
            position: "center", 
            stopOnFocus: true, 
            style: {
              background: "linear-gradient(to right, #B8A39C, #B8AA9C)",
            },
            onClick: function(){} 
          }).showToast();
      });
      precioTotal(array);
    }) 
 }

 // Calcular precio total 
 function precioTotal(array){
    let subtotal = array.reduce((acc, muebleCarrito)=> acc + (muebleCarrito.precio*muebleCarrito.cantidad) , 0);
    let iva=subtotal*.16;
    let total=subtotal+iva;
    total == 0 ? precio.innerHTML= `No hay productos en el carrito` : precio.innerHTML = `El total es <strong>${total}</strong>`
    return total;
 }

 btnCarrito.addEventListener("click", () => {
   añadirProductos(productosCarrito);
 })

 /* Ordenar productos  */
 function ordenMenor(array){
    const menorMayor = [].concat(array)
    menorMayor.sort((a,b) => a.precio - b.precio)
    renderizarCatalogo(menorMayor)
  }
  
  function ordenMayor(array){
    const mayorMenor = [].concat(array)
    mayorMenor.sort((elem1 ,elem2) => elem2.precio - elem1.precio)
    renderizarCatalogo(mayorMenor)
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

 /* Finalizar compra */
 btnFin.addEventListener("click", ()=>{
   finCompra(productosCarrito);
 });

 function finCompra(array){
   // Alerta de confirmación
   Swal.fire({
      title: '¿Deseas finalizar la compra?',
      text: "Se enviara a tu correo la información de pago y facturación.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#b8b09c',
      cancelButtonColor: '#E79F9C',
      confirmButtonText: 'Terminar compra',
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
         // Ingreso de correo electronico
         Swal.fire({
            title: 'Correo electronico',
            input: 'email',
            text: 'Favor de ingresar su dirección de correo electronico para enviarle los datos de pago y facturación.',
            inputPlaceholder: 'Ingrese su correo electronico',
            confirmButtonColor:"#b8b09c",
          }).then((result)=>{
            if(result.isConfirmed){
               Swal.fire({
                  icon:"success",
                  title:"Compra realizada",
                  text:`La información de pago y pasos a seguir se ha enviado con éxito.`,
                  confirmButtonColor:"#b8b09c"
               })
            }
          })
          productosCarrito=[];
          localStorage.removeItem("carrito")
          precioTotal(productosCarrito);
      }else{
         //Alerta de compra no realizada
         Swal.fire({
            icon: 'error',
            title: 'Compra no realizada',
            text: 'La compra no ha sido realizada, sus productos permaneceran en el carrito.',
            confirmButtonColor:"#b8b09c",
            timer:2000
          })
      }
    })
 }

/* TimeOut */
setTimeout(()=>{
   loaderTexto.innerText = `Conoce nuestros productos`
   loader.remove()
   renderizarCatalogo(productos)
},1000)