using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace FacturasAPI.Dominio.Modelo
{
    public class Respuesta
    {
        public bool Exito { get; set; }
        public string Mensaje { get; set; } = string.Empty;
        public List<string> Errores { get; set; } = [];
        public object? Datos { get; set; }

        public Respuesta() { }

        public Respuesta(object data, string message = "OK")
        {
            Exito = true;
            Datos = data;
            Mensaje = message;
        }

        public Respuesta(ModelStateDictionary ModelState)
        {
            Errores = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();

            Exito = false;
        }
    }
}
