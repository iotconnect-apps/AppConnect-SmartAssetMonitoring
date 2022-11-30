using component.logger;
using component.messaging.Database;
using component.messaging.Messages;
using component.messaging.ServiceBus;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using LogHandler = component.services.loghandler;

namespace component.messaging
{
    public static class CustomStartup
    {
        public static void AddIOTConnectSyncManager(IServiceCollection services,
            string connectionString, string serviceBusEndpoint, string serviceBusTopic, string subscriptionName, 
            string subscriptionBaseUrl, string subscriptionClientID, string subscriptionClientSecret, string subscriptionUserName)
        {

            var logger = services.BuildServiceProvider().GetRequiredService<LogHandler.Logger>();

            services.AddSingleton<IMessageHandler, MessageHandler>();
            services.AddSingleton<ITopicSubscriber>(new TopicSubscriber(serviceBusEndpoint, serviceBusTopic, subscriptionName, logger));
            services.AddSingleton<IDatabaseManager>(new DatabaseManager(connectionString, logger, subscriptionBaseUrl, subscriptionClientID, subscriptionClientSecret, subscriptionUserName));
            services.BuildServiceProvider().GetRequiredService<IMessageHandler>().InitializeSubscribers();
        }
    }
}
