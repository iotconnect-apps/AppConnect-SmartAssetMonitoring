using iot.solution.model.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Entity = iot.solution.entity;
using Model = iot.solution.model.Models;

namespace iot.solution.model.Repository.Interface
{
    public interface IAppSettingRepository
    {
        /// <summary>
        /// GetAll
        /// </summary>
        /// <returns></returns>
        Task<List<AppSetting>> GetAll();

    }
}