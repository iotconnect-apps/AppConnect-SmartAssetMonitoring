
using iot.solution.model.Repository.Interface;
using Model = iot.solution.model.Models;
using LogHandler = component.services.loghandler;
namespace iot.solution.model.Repository.Implementation
{
    public class MediaTagRepository : GenericRepository<Model.MediaTags>, IMediaTagRepository
    {
        private readonly LogHandler.Logger logger;
        public MediaTagRepository(IUnitOfWork unitOfWork, LogHandler.Logger logManager) : base(unitOfWork, logManager)
        {
            _uow = unitOfWork;
            logger = logManager;
        }
    }
}