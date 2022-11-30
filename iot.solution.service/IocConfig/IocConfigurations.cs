using iot.solution.model;
using iot.solution.model.Models;
using iot.solution.model.Repository.Implementation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using NetCore.AutoRegisterDi;
using System.Reflection;
using component.helper;
using component.helper.Interface;
using iot.solution.model.Repository.Interface;
using iot.solution.service.AppSetting;

namespace iot.solution.service.IocConfig
{
    public class IocConfigurations
    {
        public static void Initialize(IServiceCollection services)
        {

            //resolve dependency of processing & object services
            services.RegisterAssemblyPublicNonGenericClasses().Where(c => c.Name.EndsWith("Service")).AsPublicImplementedInterfaces();

            //repository
            services.RegisterAssemblyPublicNonGenericClasses(Assembly.GetAssembly(typeof(UserRepository))).Where(c => c.Name.EndsWith("Repository")).AsPublicImplementedInterfaces();

            services.AddSingleton<IAppSettingRepository, AppSettingRepository>();

        }
    }
}
