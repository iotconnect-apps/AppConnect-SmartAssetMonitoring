using component.logger;
using iot.solution.data;
using iot.solution.model.Repository.Interface;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Entity = iot.solution.entity;
using Model = iot.solution.model.Models;
using LogHandler = component.services.loghandler;
using System.Threading.Tasks;
using iot.solution.model.Models;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.EntityFrameworkCore;

namespace iot.solution.model.Repository.Implementation
{
    public class AppSettingRepository : IAppSettingRepository
    {
        private readonly LogHandler.Logger logger;

        /// <summary>
        /// The context
        /// </summary>
        private readonly devassetmonitoringContext _context;

        /// <summary>
        /// Gets the unit of work.
        /// </summary>
        /// <value>
        /// The unit of work.
        /// </value>
        //public IUnitOfWork UnitOfWork
        //{
        //    get
        //    {
        //        return _context;
        //    }
        //}

        /// <summary>
        /// Initializes a new instance of the <see cref="AppSettingRepository"/> class.
        /// </summary>
        /// <param name="context">The context.</param>
        /// <exception cref="ArgumentNullException">context</exception>
        public AppSettingRepository(devassetmonitoringContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        /// <summary>
        /// Gets the specified application setting keys.
        /// </summary>
        /// <param name="appSettingKeys">The application setting keys.</param>
        /// <returns></returns>
        public async Task<List<AppSetting>> Get(List<string> appSettingKeys)
        {
            return await _context.AppSettings
                    .Where(x => x.Key != null && x.Key != string.Empty && appSettingKeys.Contains(x.Key.ToLower()))
                    .Select(x => x).ToListAsync();
        }

        /// <summary>
        /// Gets all.
        /// </summary>
        /// <returns></returns>
        public async Task<List<AppSetting>> GetAll()
        {
            return await _context.AppSettings.Where(x => x.Key != null && x.Key != string.Empty).Select(x => x).ToListAsync();
        }

    }
}