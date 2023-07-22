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

/* Instanciar catalogo */
const prod1 = new Producto(1,"Mesa de comedor", "Mesa de comedor de elegante y robusta, con un acabado en madera que le brinda calidez y versatilidad para adaptarse a cualquier estilo de decoración.",3000,"mesacomedor.webp",1);
const prod2 = new Producto(2,"Escritorio","El escritorio blanco presenta líneas limpias y modernas, con amplio espacio de trabajo, compartimentos de almacenamiento integrados y una superficie resistente, perfecto para crear un ambiente funcional y organizado en cualquier oficina o estudio.",1500,"escritorio.webp",1);
const prod3 = new Producto(3,"Cama individual","La base de cama individual ofrece un diseño contemporáneo y elegante, con una estructura sólida y resistente que brinda soporte óptimo, mientras que su tono neutro se adapta fácilmente a cualquier estilo de dormitorio.",3000,"camaind.webp",1);
const prod4 = new Producto(4,"Cama matrimonial","La base de cama matrimonial combina funcionalidad y estilo, con un diseño moderno, una estructura robusta y un tono suave que aporta luminosidad y tranquilidad al espacio de descanso.",5000,"camamat.webp",1);
const prod5 = new Producto(5,"Set de sillas","El set de 4 sillas blancas para comedor combina un diseño moderno y minimalista con la comodidad y durabilidad de su estructura ergonómica, brindando un toque de elegancia y luminosidad a cualquier espacio.",3000,"silla.webp",1);
const prod6 = new Producto(6,"Set de bancos","El set de 4 bancos cuenta con un diseño moderno y minimalista, asientos cómodos y una estructura duradera, ofreciendo una solución versátil y elegante para completar el mobiliario de cualquier bar o cocina.",2250,"banco.webp",1);
const prod7 = new Producto(7,"Librero","El librero blanco presenta un diseño contemporáneo y funcional, con estantes ajustables para adaptarse a diferentes tamaños de libros y objetos decorativos, brindando organización y estilo a cualquier espacio de almacenamiento.",4800,"librero.webp",1);
const prod8 = new Producto(8,"Buró","El buró combina belleza y funcionalidad con su diseño elegante y acabado en madera, ofreciendo espacio de almacenamiento con cajones espaciosos y una superficie resistente, ideal para complementar cualquier dormitorio con estilo y practicidad.",1600,"buro.webp",1);
const prod9 = new Producto(9,"Armario","El armario blanco presenta un diseño clásico y atemporal, con amplio espacio de almacenamiento, estantes ajustables y un elegante acabado en blanco que se adapta a cualquier estilo de decoración, proporcionando organización y estilo a cualquier habitación.",5000,"armario.webp",1);

/* Array del catalogo */
let productos = []; 
 
// Añadir productos al catalogo
if(localStorage.getItem("productos")){
    productos = JSON.parse(localStorage.getItem("productos"));
}else{
    productos.push(prod1, prod2, prod3, prod4, prod5, prod6, prod7, prod8, prod9);
    localStorage.setItem("productos", JSON.stringify(productos));
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