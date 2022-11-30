using component.eventbus;
using component.eventbus.Common;
using component.eventbus.Common.Enum;
using component.eventbus.Model.Topic.Logger;
using component.logger;
using Hangfire;
using host.iot.solution.Filter;
using host.iot.solution.Middleware;
using host.iot.solution.RecurringJobs;
using IdentityServer4.AccessTokenValidation;
using iot.solution.host;
using iot.solution.service.IocConfig;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using Mapper = iot.solution.service.Mapper;
using System.Net;
using System.Net.Mail;
using component.helper;
using component.helper.Interface;
using Hangfire.Dashboard;

using host.iot.solution.Hubs;
using Microsoft.AspNetCore.Cors.Infrastructure;
using IoT.Solution.SignalR.Manager;
using component.messaging;
using iot.solution.common;
using iot.solution.service.AppSetting;
using iot.solution.model;
using iot.solution.model.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using ATune.Media.Nuget.Data;
using ATune.Media.Nuget.Interface;
using ATune.Media.Nuget;
using ATune.Media.Nuget.Extension;
using ATune.Document.Nuget.Common;
using ATune.Document.Nuget;
using ATune.Document.Nuget.Data;

namespace host.iot.solution
{
    public class Startup
    {
        public Startup(IConfiguration configuration, IWebHostEnvironment environment)
        {
            var core = new ConfigurationBuilder();
            core
                    .SetBasePath(environment.ContentRootPath)
                    .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);


            core.AddEnvironmentVariables();
            Configuration = core.Build();
            HostEnvironment = environment;
            AppConfig.Configuration = configuration;
        }

        public IConfiguration Configuration { get; }
        public IWebHostEnvironment HostEnvironment { get; }
        public void ConfigureServices(IServiceCollection services)
        {
            try
            {

                component.helper.SolutionConfiguration.Init(HostEnvironment.WebRootPath);
                component.helper.SolutionConfiguration.Configuration.ConnectionString = Configuration.GetConnectionString("AscaleAssetMonitoringDataConnection");
                //services
                //.AddEntityFrameworkSqlServer()
                //  .AddDbContext<devassetmonitoringContext>(options =>
                //   options.UseSqlServer(Configuration.GetConnectionString("AscaleAssetMonitoringDataConnection"), retryOption =>
                //   {
                //       retryOption.EnableRetryOnFailure(
                //           maxRetryCount: 2,
                //           maxRetryDelay: TimeSpan.FromSeconds(1),
                //           errorNumbersToAdd: new List<int> { });
                //   })
                //   , ServiceLifetime.Transient);

                services
               .AddEntityFrameworkSqlServer()
                 .AddDbContext<devassetmonitoringContext>(options =>
                  options.UseSqlServer(Configuration.GetConnectionString("AscaleAssetMonitoringDataConnection"))
                  , ServiceLifetime.Transient);

                services.AddCorsMiddleware(Configuration);
                services.AddMvcCore().AddNewtonsoftJson();
                services.AddMvc(config => { config.Filters.Add(new ActionFilterAttribute()); });
                services.Configure<ApiBehaviorOptions>(options =>
                {
                    options.SuppressModelStateInvalidFilter = true;
                });

                services.AddCors(options =>
                {
                    options.AddPolicy("ClientPermission", policy =>
                    {
                        policy.AllowAnyHeader()
                            .AllowAnyMethod()
                            .WithOrigins(AppConfig.AllowedCorsOrigins)
                            .AllowCredentials();
                    });
                });
                services.AddSingleton<ICorsPolicyProvider, CorsPolicyProvider>();
                services.AddSingleton<ISignalRGroupManager, SignalRGroupManager>();
                services.AddSignalR();

                ConfigureServicesCollection(services);

                services.AddSingleton(typeof(ServiceAppSetting));
                services.BuildServiceProvider().GetService<ServiceAppSetting>().GetDefaultServiceAppSettings();
                services.AddTransient<IUnitOfWork, UnitOfWork>();
                services.AddScoped<DbContext, devassetmonitoringContext>();

                #region Solution Logger
                ConcurrentDictionary<string, string> eventBusConfigurationList = new ConcurrentDictionary<string, string>();
                eventBusConfigurationList.TryAdd("BrokerConnection", ServiceAppSetting.Instance.GetRequiredAppSettingByKey(AppSettingKey.LoggerBrokerConnection.ToString()));
                services.AddSingleton(s => new EventBusConfiguration(eventBusConfigurationList));

                services.Configure<DomainManager>(s =>
                {
                    //TODO: change serviceType accrodingly
                    s.ApplicationType = ServiceAppSetting.Instance.GetRequiredAppSettingByKey(AppSettingKey.LoggerSolutionName.ToString());
                    s.ServiceType = ServiceAppSetting.Instance.GetRequiredAppSettingByKey(AppSettingKey.LoggerSolutionName.ToString()) + "_LoggerService";

                    s.DomainConfiguration = new List<Type>
                        {
                            typeof(DebugLoggerModel), typeof(ErrorLoggerModel), typeof(WarningLoggerModel), typeof(InfoLoggerModel), typeof(FatalLoggerModel)
                        };
                });
                services.AddTransient<ILogger, Logger>();
                services.AddTransient<IEventBus, AzureServiceBusManager>();
                services.AddSingleton(typeof(component.services.loghandler.Logger));
                #endregion

                services.AddAuthentication(IdentityServerAuthenticationDefaults.AuthenticationScheme).AddIdentityServerAuthentication("CompanyUser", o =>
                {
                    o.Authority = ServiceAppSetting.Instance.GetRequiredAppSettingByKey(AppSettingKey.TokenAuthority.ToString());
                    o.ApiName = ServiceAppSetting.Instance.GetRequiredAppSettingByKey(AppSettingKey.TokenApiName.ToString());
                    o.ApiSecret = ServiceAppSetting.Instance.GetRequiredAppSettingByKey(AppSettingKey.TokenApiSecret.ToString());
                    o.EnableCaching = Convert.ToBoolean(ServiceAppSetting.Instance.GetRequiredAppSettingByKey(AppSettingKey.TokenEnableCaching.ToString()));
                    o.CacheDuration = TimeSpan.FromMinutes(Convert.ToInt32(ServiceAppSetting.Instance.GetRequiredAppSettingByKey(AppSettingKey.TokenCacheDurationMinutes.ToString())));
                    o.RequireHttpsMetadata = Convert.ToBoolean(ServiceAppSetting.Instance.GetRequiredAppSettingByKey(AppSettingKey.TokenRequireHttpsMetadata.ToString()));
                });
                services.AddAuthentication(Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme).AddJwtBearer("Mobile", options =>
                {
                    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = ServiceAppSetting.Instance.GetRequiredAppSettingByKey(AppSettingKey.TokenIssuer.ToString()).ToLower(),
                        ValidAudience = ServiceAppSetting.Instance.GetRequiredAppSettingByKey(AppSettingKey.TokenAudience.ToString()).ToLower(),
                        IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(ServiceAppSetting.Instance.GetRequiredAppSettingByKey(AppSettingKey.TokenSecurityKey.ToString())))
                    };
                });
                services.AddAuthentication(Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme).AddJwtBearer("Admin", options =>
                {
                    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = ServiceAppSetting.Instance.GetRequiredAppSettingByKey(AppSettingKey.TokenIssuer.ToString()).ToLower(),
                        ValidAudience = ServiceAppSetting.Instance.GetRequiredAppSettingByKey(AppSettingKey.TokenAudience.ToString()).ToLower(),
                        IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(ServiceAppSetting.Instance.GetRequiredAppSettingByKey(AppSettingKey.TokenSecurityKey.ToString()))),
                        ClockSkew = TimeSpan.Zero
                    };
                });


                services.AddScoped<IMediaDbContext, ATune.Media.Nuget.Data.MediaContext>();
                services.AddScoped<IImageOperation, ImageOperation>();

                services.Configure<AzureConfigurationManager>(s =>
                {
                    s.DBConnectionString = Configuration.GetConnectionString("AscaleAssetMonitoringDataConnection");
                    s.AzureConnectionString = ServiceAppSetting.Instance.GetRequiredAppSettingByKey(AppSettingKey.MediaAzureConnectionString.ToString());
                    s.MediaTimeoutMinutes = Convert.ToInt32(ServiceAppSetting.Instance.GetRequiredAppSettingByKey(AppSettingKey.MediaTimeoutMinutes.ToString()));
                    s.BlobContainerName = ServiceAppSetting.Instance.GetRequiredAppSettingByKey(AppSettingKey.MediaBlobContainerName.ToString());
                    s.AzureFun_GenerateImageURL = ServiceAppSetting.Instance.GetRequiredAppSettingByKey(AppSettingKey.AzureFun_GenerateImageURL.ToString());
                    s.AzureFun_DeleteImageURL = ServiceAppSetting.Instance.GetRequiredAppSettingByKey(AppSettingKey.AzureFun_DeleteImageURL.ToString());
                });

                services.AddSingleton<IDocumentContext, DocumentContext>();
                services.AddSingleton<IDocumentOprerations, DocumentOprerations>();
                services.Configure<DocumentAzureConfigurationManager>(s =>
                {
                    s.DBConnectionString = Configuration.GetConnectionString("AscaleAssetMonitoringDataConnection");
                    s.AzureConnectionString = ServiceAppSetting.Instance.GetRequiredAppSettingByKey(AppSettingKey.MediaAzureConnectionString.ToString());
                    s.DocumentTimeoutMinutes = Convert.ToInt32(ServiceAppSetting.Instance.GetRequiredAppSettingByKey(AppSettingKey.MediaTimeoutMinutes.ToString()));
                    s.BlobContainerName = ServiceAppSetting.Instance.GetRequiredAppSettingByKey(AppSettingKey.MediaBlobContainerName.ToString());
                });



                Mapper.Configuration.Initialize();
                SwaggerExtension.ConfigureService(services, Configuration);
                ConfigureMessaging(services);
                services.AddControllers();
                ConfigureHangfireSettings(services);
                component.helper.DependencyResolver.Init(services);
                services.AddScoped<SmtpClient>((serviceProvider) =>
                {
                    var config = serviceProvider.GetRequiredService<IConfiguration>();
                    return new SmtpClient()
                    {
                        Host = ServiceAppSetting.Instance.GetRequiredAppSettingByKey(AppSettingKey.SmtpHost.ToString()),
                        Port = Convert.ToInt32(ServiceAppSetting.Instance.GetRequiredAppSettingByKey(AppSettingKey.SmtpPort.ToString())),
                        Credentials = new NetworkCredential(
                                ServiceAppSetting.Instance.GetRequiredAppSettingByKey(AppSettingKey.SmtpUserName.ToString()),
                                ServiceAppSetting.Instance.GetRequiredAppSettingByKey(AppSettingKey.SmtpPassword.ToString())
                            )
                    };
                });
            }
            catch (Exception ex)
            {
                LogStartupError(services, ex);
            }
        }
        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IServiceProvider serviceProvider)
        {
            try
            {
                GlobalConfiguration.Configuration
            .UseActivator(new HangfireActivator(serviceProvider));

                app.UseHangfireDashboard("/hangfire", new DashboardOptions
                {
                    Authorization = new[] { new MyAuthorizationFilter() },
                    IgnoreAntiforgeryToken = true
                });
                app.UseHangfireServer(new BackgroundJobServerOptions { WorkerCount = Environment.ProcessorCount });

                if (env.IsDevelopment())
                {
                    app.UseDeveloperExceptionPage();
                }

                app.UseCorsMiddleware();
                SwaggerExtension.Configure(app);
                app.UseStaticFiles();
                app.UseRouting();
                app.UseAuthentication();
                app.UseAuthorization();
                app.UseHeaderkeyAuthorization();

                app.UseEndpoints(endpoints =>
                {
                    endpoints.MapControllers();
                    endpoints.MapHub<NotificationHub>("/notificationhub");
                });

                app.UseEndpoints(endpoints =>
                {
                    endpoints.MapControllers();
                });
                if (Convert.ToBoolean(ServiceAppSetting.Instance.GetRequiredAppSettingByKey(AppSettingKey.HangFireEnabled.ToString())))
                {
                    StartHangFireBackgroundJobs();
                }
            }
            catch (Exception ex)
            {
                var log = app.ApplicationServices.GetService<component.services.loghandler.Logger>();
                if (log != null)
                {
                    log.FatalLog(ex.ToString(), ex);
                }
            }
        }
        private void ConfigureHangfireSettings(IServiceCollection services)
        {
            services.AddHangfire(x => x.UseSqlServerStorage(component.helper.SolutionConfiguration.Configuration.ConnectionString));
        }

        private static void StartHangFireBackgroundJobs()
        {
            // Note: if you ever remove one of these, either delete it via HangFire UI
            // or from the database manually. Removing the code entry does NOT stop the
            // existing job running.
            RecurringJob.AddOrUpdate<ITelemetryDataJob>(
                job => job.DailyProcess(),
                Cron.Daily);
            RecurringJob.AddOrUpdate<ITelemetryDataJob>(
               job => job.HourlyProcess(), string.Format("0 */{0} * * *", ServiceAppSetting.Instance.GetRequiredAppSettingByKey(AppSettingKey.HangFireTelemetryHours.ToString())));
            RecurringJob.AddOrUpdate<ITelemetryDataJob>(
             job => job.SubscriptionMailProcess(),
             Cron.Daily);
        }
        private void ConfigureServicesCollection(IServiceCollection services)
        {
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddSingleton<IActionContextAccessor, ActionContextAccessor>();



            IocConfigurations.Initialize(services);
            services.AddScoped<ITelemetryDataJob, TelemetryDataJob>();
            services.AddScoped<IEmailHelper, EmailHelper>();
        }
        private void ConfigureMessaging(IServiceCollection services)
        {
            if (!string.IsNullOrWhiteSpace(ServiceAppSetting.Instance.GetRequiredAppSettingByKey(AppSettingKey.MessagingServicebusEndPoint.ToString())))
            {
                component.messaging.CustomStartup.AddIOTConnectSyncManager(services, component.helper.SolutionConfiguration.Configuration.ConnectionString,
                ServiceAppSetting.Instance.GetRequiredAppSettingByKey(AppSettingKey.MessagingServicebusEndPoint.ToString()),
                ServiceAppSetting.Instance.GetRequiredAppSettingByKey(AppSettingKey.MessagingTopicName.ToString()),
                ServiceAppSetting.Instance.GetRequiredAppSettingByKey(AppSettingKey.MessagingSubscriptionName.ToString()), ServiceAppSetting.Instance.GetRequiredAppSettingByKey(AppSettingKey.SubscriptionBaseUrl.ToString()),
                ServiceAppSetting.Instance.GetRequiredAppSettingByKey(AppSettingKey.SubscriptionClientID.ToString()),
                ServiceAppSetting.Instance.GetRequiredAppSettingByKey(AppSettingKey.SubscriptionClientSecret.ToString()),
                ServiceAppSetting.Instance.GetRequiredAppSettingByKey(AppSettingKey.SubscriptionUserName.ToString()));
            }
        }
        public void LogStartupError(IServiceCollection services, Exception ex)
        {
            services.AddScoped(typeof(component.services.loghandler.Logger));

            ConcurrentDictionary<string, string> eventBusConfigurationList = new ConcurrentDictionary<string, string>();
            eventBusConfigurationList.TryAdd("BrokerConnection", ServiceAppSetting.Instance.GetRequiredAppSettingByKey(AppSettingKey.LoggerBrokerConnection.ToString()));
            services.AddSingleton(s => new EventBusConfiguration(eventBusConfigurationList));

            services.Configure<DomainManager>(s =>
            {
                s.ApplicationType = ServiceAppSetting.Instance.GetRequiredAppSettingByKey(AppSettingKey.LoggerSolutionName.ToString());
                s.ServiceType = ServiceAppSetting.Instance.GetRequiredAppSettingByKey(AppSettingKey.LoggerSolutionName.ToString()) + "_LoggerService";

                s.DomainConfiguration = new List<Type>
                    {
                        typeof(DebugLoggerModel), typeof(ErrorLoggerModel), typeof(WarningLoggerModel), typeof(InfoLoggerModel), typeof(FatalLoggerModel),
                    };
            });
            var buildService = services.BuildServiceProvider();
            var logger = buildService.GetService<component.services.loghandler.Logger>().FatalLog(ex.ToString(), ex);
        }

        /// <summary>
        ///
        /// </summary>
        /// <seealso cref="Hangfire.Dashboard.IDashboardAuthorizationFilter" />
        public class MyAuthorizationFilter : IDashboardAuthorizationFilter
        {
            /// <summary>
            /// Authorizes the specified context.
            /// </summary>
            /// <param name="context">The context.</param>
            /// <returns></returns>
            public bool Authorize(DashboardContext context)
            {
                // Allow all authenticated users to see the Dashboard (potentially dangerous).
                return true;
            }
        }
    }
}