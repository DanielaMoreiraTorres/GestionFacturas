using FacturasAPI.Dominio.Modelo;
using FacturasAPI.Infraestructura.Datos.IRepositorio;

namespace FacturasAPI.Aplicacion.Catalogo
{
    public class CatalogoServicio : ICatalogoServicio
    {
        private readonly ICatalogoRepositorio _catalogoRepositorio;

        public CatalogoServicio(ICatalogoRepositorio catalogoRepositorio)
        {
            _catalogoRepositorio = catalogoRepositorio;
        }

        public async Task<Respuesta> CatalogoTipoIdentificacion()
        {
            var catalogo = await _catalogoRepositorio.ObtenerCatalogoTipoIdentificacion();
            return new Respuesta(catalogo);
        }
    }
}
