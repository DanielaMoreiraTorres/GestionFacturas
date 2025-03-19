using FacturasAPI.Dominio.Modelo;
using FacturasAPI.Infraestructura.Datos.IRepositorio;
using FacturasAPI.Infraestructura.Datos.Repositorio;

namespace FacturasAPI.Aplicacion.Producto
{
    public class ProductoServicio : IProductoServicio
    {
        private readonly IProductoRepositorio _productoRepositorio;

        public ProductoServicio(IProductoRepositorio productoRepositorio)
        {
            _productoRepositorio = productoRepositorio;
        }

        public async Task<Respuesta> Agregar(Dominio.Producto modelo)
        {
            if (!await _productoRepositorio.ObtenerProducto(modelo.Codigo))
            {
                var producto = await _productoRepositorio.AgregarProducto(modelo);
                return new Respuesta(producto);
            }

            return new Respuesta()
            {
                Exito = false,
                Mensaje = "El código del producto ya está en uso",
                Errores = ["Registro falló"]
            };
        }

        public async Task<Respuesta> Eliminar(int id)
        {
            var producto = await _productoRepositorio.ObtenerProductoPorId(id);
            if (producto != null)
            {
                await _productoRepositorio.EliminarProducto(producto);
                return new Respuesta(producto);
            }

            return new Respuesta()
            {
                Exito = false,
                Mensaje = "No se pudo eliminar el producto",
                Errores = ["Eliminación falló"]
            };
        }

        public async Task<Respuesta> Listar(PeticionLista modelo)
        {
            var productos = await _productoRepositorio.ObtenerProductos(modelo);
            return new Respuesta(productos);
        }

        /// <summary>
        /// Metodo para modificar la informacion del producto
        /// </summary>
        /// <param name="modelo">Modelo  contiene los datos del producto</param>
        /// <param name="id">Id del producto</param>
        /// <returns>Modelo del producto modificado</returns>
        public async Task<Respuesta> Modificar(int id, Dominio.Producto modelo)
        {
            if (await _productoRepositorio.ObtenerProducto(modelo.Codigo, id))
            {
                var producto = await _productoRepositorio.ModificarProducto(modelo);
                return new Respuesta(producto);
            }

            return new Respuesta()
            {
                Exito = false,
                Mensaje = "El código del producto ya está en uso",
                Errores = ["Modificación falló"]
            };
        }

        public async Task<Respuesta> Obtener(int id)
        {
            var producto = await _productoRepositorio.ObtenerProductoPorId(id);

            if (producto != null)
            {
                return new Respuesta(producto);
            }

            return new Respuesta()
            {
                Exito = false,
                Mensaje = "Error a obtener producto",
                Errores = ["Obtener por Id falló"]
            };
        }
    }
}
