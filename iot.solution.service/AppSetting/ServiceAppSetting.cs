using iot.solution.common;
using iot.solution.model.Models;
using iot.solution.model.Repository.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iot.solution.service.AppSetting
{
    public class ServiceAppSetting
    {
        readonly IAppSettingRepository _appSettingRepository;
        private static List<model.Models.AppSetting> _appSettings { get; set; }

        private static ServiceAppSetting instance = null;

        private static readonly object _lock = new object();

        private ServiceAppSetting()
        {
        }

        public static ServiceAppSetting Instance
        {
            get
            {
                if (instance == null)
                {
                    lock (_lock)
                    {

                        // create the instance only if the instance is null
                        if (instance == null)
                        {
                            instance = new ServiceAppSetting();
                        }
                    }
                }
                // Otherwise return the already existing instance
                return instance;
            }
        }

        public ServiceAppSetting(IAppSettingRepository appSettingRepository)
        {
            _appSettingRepository = appSettingRepository ?? throw new ArgumentNullException(nameof(appSettingRepository));
        }

        public void GetDefaultServiceAppSettings()
        {
            List<model.Models.AppSetting> appSettingList = new List<model.Models.AppSetting>();

            var getTask = _appSettingRepository.GetAll();
            appSettingList = getTask.Result;

            if (appSettingList != null && appSettingList.Count > 0)
            {
                _appSettings = new List<model.Models.AppSetting>();
                _appSettings.AddRange(appSettingList);
            }
        }

        public string GetRequiredAppSettingByKey(string appSettingKey)
        {
            if (_appSettings?.Any() == true)
                return _appSettings.Where(x => x.Key.Contains(appSettingKey)).Select(x => x.Value).FirstOrDefault() ?? General.RaiseConfigurationMissingException(appSettingKey);
            else
                return General.RaiseConfigurationMissingException(appSettingKey);
        }

        public List<model.Models.AppSetting> GetAllAppSettingKeys()
        {
            if (_appSettings?.Any() == true)
                return _appSettings;
            else
                return new List<model.Models.AppSetting>();
        }


    }
}
