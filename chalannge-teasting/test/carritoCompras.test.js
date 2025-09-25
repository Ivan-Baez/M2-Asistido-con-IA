
const carritoCompra = require("../index.js");

const productoMockup = { nombre: "Producto", precio: 1000 };
const carritoClase = new carritoCompra();

describe("test de la clase carrito compra", () => {
    it("Debe tener un constructor que inicialice el como un array vacio", () => {
        expect(carritoClase.cart).toEqual([]);
    });

    it("Debe contener el metodo agregarProducto(producto) y lo agrega al carrito", () => {
        expect(carritoClase.cart.length).toBe(0);
        carritoClase.agregarProducto(productoMockup);
        expect(carritoClase.cart.length).toBe(1);
        carritoClase.agregarProducto(productoMockup);
        carritoClase.agregarProducto(productoMockup);
        expect(carritoClase.cart.length).toBe(3);
    });

    it("Debe contener el metodo calcularTotal() que sume todos los precios de los productos", () => {
        carritoClase.agregarProducto(productoMockup);
        carritoClase.agregarProducto(productoMockup);
        expect(carritoClase.calcularTotal()).toBe(2000);
    });

    it("Debe contener el metodo aplicarDescuento(porcentaje) aplica un descuento al total de la compra", () => {
        carritoClase.agregarProducto(productoMockup);
        carritoClase.agregarProducto(productoMockup);
        expect(carritoClase.aplicarDescuento(50)).toBe(1000);
    });
});