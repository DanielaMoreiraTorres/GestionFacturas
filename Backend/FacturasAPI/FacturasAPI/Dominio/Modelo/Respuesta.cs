using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace FacturasAPI.Dominio.Modelo
{
    public class Respuesta
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; } = string.Empty;
        public List<string> Errors { get; set; } = [];
        public object? Data { get; set; }

        public Respuesta() { }

        public Respuesta(object data, string message = "OK")
        {
            IsSuccess = true;
            Data = data;
            Message = message;
        }

        public Respuesta(ModelStateDictionary ModelState)
        {
            Errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();

            IsSuccess = false;
        }
    }
}
