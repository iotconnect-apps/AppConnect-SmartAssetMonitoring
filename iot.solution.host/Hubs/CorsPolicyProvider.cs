using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace host.iot.solution.Hubs
{
    public class CorsPolicyProvider : ICorsPolicyProvider
    {
        private readonly IConfiguration _configuration;
        public CorsPolicyProvider(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public Task<CorsPolicy> GetPolicyAsync(HttpContext context, string policyName)
        {
            AppConfig.Configuration = _configuration;
            CorsPolicyBuilder policyBuilder = new CorsPolicyBuilder(AppConfig.AllowedCorsOrigins);
            policyBuilder.AllowAnyHeader();
            policyBuilder.AllowAnyMethod();
            policyBuilder.AllowCredentials();
            return Task.FromResult(policyBuilder.Build());
        }
    }
}
