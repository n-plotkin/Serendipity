using System.Text.Json;
using API.Helpers;

//This is an extension method to call which will add our pagination header to our http response

namespace API.Extensions
{
    public static class HttpExtensions
    {
        public static void AddPaginationHeader(this HttpResponse response, PaginationHeader header)
        {
            var jsonOptions = new JsonSerializerOptions{PropertyNamingPolicy = JsonNamingPolicy.CamelCase};
            response.Headers.Add("Pagination", JsonSerializer.Serialize(header, jsonOptions));
            //makes the header visable
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }
    }
}