using iot.solution.entity.Response;
using iot.solution.model.Repository.Interface;
using iot.solution.service.Interface;
using System;
using System.Linq;
using IOT = IoTConnect.Model;
using component.helper;
using Microsoft.Extensions.Configuration;
using iot.solution.common;
using iot.solution.service.AppSetting;

namespace iot.solution.service.Implementation
{
    public class ConfigurationService : IConfigurationService
    {
        private readonly ICompanyRepository _companyRepository;
        private readonly IotConnectClient _iotConnectClient;
        public  IConfiguration _configuration { get; set; }
        public ConfigurationService(ICompanyRepository companyRepository, IConfiguration configuration)
        {
            _configuration = configuration;
            _companyRepository = companyRepository;
            _iotConnectClient = new IotConnectClient(SolutionConfiguration.BearerToken, ServiceAppSetting.Instance.GetRequiredAppSettingByKey(AppSettingKey.EnvironmentCode.ToString()), ServiceAppSetting.Instance.GetRequiredAppSettingByKey(AppSettingKey.SolutionKey.ToString()));
        }
        public StompReaderData GetConfguration(string key)
        {
            string configuarationtype = "stomp";
            if (key == "LiveData")
            {
                configuarationtype = "stomp";
            }
            else
            {
                configuarationtype = "ui-alert";
            }

           // IOT.DataResponse<IOT.StompReaderData> deviceConnectionStatus = _iotConnectClient.Device.GetStompConfiguartionData(configuarationtype).Result;
            StompReaderData confgurationResponse = new StompReaderData();
            //if (deviceConnectionStatus != null && deviceConnectionStatus.status)
            //{
            //    confgurationResponse = new StompReaderData()
            //    {
            //        cpId = deviceConnectionStatus.data.cpId,
            //        host = deviceConnectionStatus.data.host,
            //        isSecure = deviceConnectionStatus.data.isSecure,
            //        password = deviceConnectionStatus.data.password,
            //        port = deviceConnectionStatus.data.port,
            //        url = deviceConnectionStatus.data.url,
            //        user = deviceConnectionStatus.data.user,
            //        vhost = deviceConnectionStatus.data.vhost,
            //    };
            //}
            return confgurationResponse;
        }
    }
}
