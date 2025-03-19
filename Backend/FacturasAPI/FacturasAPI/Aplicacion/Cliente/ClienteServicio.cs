using FacturasAPI.Dominio.Modelo;
using FacturasAPI.Infraestructura.Datos.IRepositorio;
using FacturasAPI.Infraestructura.Datos.Repositorio;

namespace FacturasAPI.Aplicacion.Cliente
{
    public class ClienteServicio : IClienteServicio
    {
        private readonly IClienteRepositorio _clienteRepositorio;

        public ClienteServicio(IClienteRepositorio clienteRepositorio)
        {
            _clienteRepositorio = clienteRepositorio;
        }

        public async Task<Respuesta> Agregar(Dominio.Cliente modelo)
        {
            if (!await _clienteRepositorio.ObtenerCliente(modelo.Identificacion))
            {
                var cliente = await _clienteRepositorio.AgregarCliente(modelo);
                return new Respuesta(cliente);
            }

            return new Respuesta()
            {
                Exito = false,
                Mensaje = "Ya existe un cliente con esa identificación",
                Errores = ["Registro falló"]
            };
        }

        public async Task<Respuesta> Eliminar(int id)
        {
            var cliente = await _clienteRepositorio.ObtenerClientePorId(id);
            if (cliente != null)
            {
                await _clienteRepositorio.EliminarCliente(cliente);
                return new Respuesta(cliente);
            }

            return new Respuesta()
            {
                Exito = false,
                Mensaje = "No se pudo eliminar el cliente",
                Errores = ["Eliminación falló"]
            };
        }

        public async Task<Respuesta> Listar(PeticionLista modelo)
        {
            var clientes = await _clienteRepositorio.ObtenerClientes(modelo);
            return new Respuesta(clientes);
        }

        /// <summary>
        /// Metodo para modificar la informacion del cliente
        /// </summary>
        /// <param name="modelo">Modelo  contiene los datos del cliente</param>
        /// <param name="id">Id del cliente</param>
        /// <returns>Modelo del cliente modificado</returns>
        public async Task<Respuesta> Modificar(int id, Dominio.Cliente modelo)
        {
            if (await _clienteRepositorio.ObtenerCliente(modelo.Identificacion, id))
            {
                var cliente = await _clienteRepositorio.ModificarCliente(modelo);
                return new Respuesta(cliente);
            }

            return new Respuesta()
            {
                Exito = false,
                Mensaje = "Ya existe un cliente con esa identificación",
                Errores = ["Modificación falló"]
            };
        }

        public async Task<Respuesta> Obtener(int id)
        {
            var cliente = await _clienteRepositorio.ObtenerClientePorId(id);

            if (cliente != null)
            {
                return new Respuesta(cliente);
            }

            return new Respuesta()
            {
                Exito = false,
                Mensaje = "Error a obtener cliente",
                Errores = ["Obtener por Id falló"]
            };
        }
    }
}
