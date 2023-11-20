using API.Data;
using Microsoft.EntityFrameworkCore;
using API.Services;
using API.Interfaces;
using API.Helpers;
using API.SignalR;

namespace API.Extensions
{
    //Make it static so we can use the methods inside without instantiating 
    //a new instance of the class
    public static class ApplicationServiceExtensions 
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)

        {
            services.AddDbContext<DataContext>(opt => 
            {
                opt.UseSqlite(config.GetConnectionString("DefaultConnection"));
            });

            //How long shall a service be added for? 
            services.AddScoped<ITokenService, TokenService>();
            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));
            services.AddScoped<IPhotoService, PhotoService>();
            services.AddScoped<LogUserActivity>();
            services.AddSignalR();
            //we want the onlineusers service to be the same service, available to everyone, so singleton.
            services.AddSingleton<PresenceTracker>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            return services;
        }
    }
}