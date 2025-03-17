using System.IdentityModel.Tokens.Jwt;
using FacturasAPI.Dominio.Modelo;

namespace FacturasAPI.Aplicacion.Usuario
{
    public interface IUsuarioServicio
    {
        Task<Respuesta> InicioSesion(InicioSesion modelo);
    }
}
