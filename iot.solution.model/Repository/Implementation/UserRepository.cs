﻿using component.logger;
using iot.solution.data;
using iot.solution.model.Repository.Interface;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Entity = iot.solution.entity;
using Model = iot.solution.model.Models;
using LogHandler = component.services.loghandler;
using Microsoft.EntityFrameworkCore;

namespace iot.solution.model.Repository.Implementation
{
    public class UserRepository : GenericRepository<Model.User>, IUserRepository
    {
        private readonly LogHandler.Logger logger;
        public UserRepository(IUnitOfWork unitOfWork, LogHandler.Logger logManager) : base(unitOfWork, logManager)
        {
            _uow = unitOfWork;
            logger = logManager;
        }
        public Model.User Get(string userName)
        {
            var result = new Model.User();
            try
            {
                logger.InfoLog(Constants.ACTION_ENTRY, "UserRepository.Get");
                _uow.DbContext.User.Where(u => u.Email.Equals(userName, StringComparison.CurrentCultureIgnoreCase)).FirstOrDefault();
                logger.InfoLog(Constants.ACTION_EXIT, "UserRepository.Get");
            }
            catch (Exception ex)
            {
                logger.ErrorLog(Constants.ACTION_EXCEPTION, ex);
            }
            return result;
        }
        public Entity.SearchResult<List<Entity.UserResponse>> List(Entity.SearchRequest request)
        {
            Entity.SearchResult<List<Entity.UserResponse>> result = new Entity.SearchResult<List<Entity.UserResponse>>();
            try
            {
                logger.InfoLog(Constants.ACTION_ENTRY, "UserRepository.Get");
                using (var sqlDataAccess = new SqlDataAccess(_uow.DbContext.Database.GetConnectionString()))
                {
                    List<System.Data.Common.DbParameter> parameters = sqlDataAccess.CreateParams(component.helper.SolutionConfiguration.CurrentUserId, request.Version);
                    parameters.Add(sqlDataAccess.CreateParameter("companyguid", component.helper.SolutionConfiguration.CompanyId, DbType.Guid, ParameterDirection.Input));
                    if (request.EntityId != Guid.Empty)
                    {
                        parameters.Add(sqlDataAccess.CreateParameter("entityGuid", request.EntityId, DbType.Guid, ParameterDirection.Input));
                    }
                    if (request.ParentEntityGuid != Guid.Empty)
                    {
                        parameters.Add(sqlDataAccess.CreateParameter("parentEntityGuid", request.ParentEntityGuid, DbType.Guid, ParameterDirection.Input));
                    }
                    parameters.Add(sqlDataAccess.CreateParameter("search", string.IsNullOrEmpty(request.SearchText) ? request.SearchText : request.SearchText.Trim(), DbType.String, ParameterDirection.Input));
                    parameters.Add(sqlDataAccess.CreateParameter("pagesize", request.PageSize, DbType.Int32, ParameterDirection.Input));
                    parameters.Add(sqlDataAccess.CreateParameter("pagenumber", request.PageNumber, DbType.Int32, ParameterDirection.Input));
                    parameters.Add(sqlDataAccess.CreateParameter("orderby", request.OrderBy, DbType.String, ParameterDirection.Input));
                    parameters.Add(sqlDataAccess.CreateParameter("count", DbType.Int32, ParameterDirection.Output, 16));
                    System.Data.Common.DbDataReader dbDataReader = sqlDataAccess.ExecuteReader(sqlDataAccess.CreateCommand("[User_List]", CommandType.StoredProcedure, null), parameters.ToArray());
                    result.Items = DataUtils.DataReaderToList<Entity.UserResponse>(dbDataReader, null);
                   // result.Count = int.Parse(parameters.Where(p => p.ParameterName.Equals("count")).FirstOrDefault().Value.ToString());
                    var count = parameters.Where(p => p.ParameterName.Equals("count")).FirstOrDefault();
                    if (count != null && !string.IsNullOrWhiteSpace(count.Value.ToString()))
                    {
                        result.Count = int.Parse(count.Value.ToString());
                    }
                    var outPut = parameters.Where(p => p.ParameterName.Equals("output")).FirstOrDefault();
                    if (outPut != null)
                    {
                        int outputvalue = int.Parse(outPut.Value.ToString());
                        result.Count = outputvalue < 0 ? outputvalue : result.Count;
                    }
                }
                logger.InfoLog(Constants.ACTION_EXIT, "UserRepository.Get");
            }
            catch (Exception ex)
            {
                logger.ErrorLog(Constants.ACTION_EXCEPTION, ex);
            }
            return result;
        }
    }
}