using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace host.iot.solution
{
    public static class AppConfig
    {
        public static IConfiguration Configuration { get; set; }
        public static string[] AllowedCorsOrigins
        {
            get
            {
                return Configuration.GetSection("CorsPolicy").GetSection("AllowOrigins").Get<string[]>();
            }
        }

        public static string Version => Configuration.GetSection("Settings").GetSection("Version").Value;
    }
}
