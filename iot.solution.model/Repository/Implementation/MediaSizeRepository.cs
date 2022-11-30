
using iot.solution.model.Repository.Interface;
using Model = iot.solution.model.Models;
using LogHandler = component.services.loghandler;
namespace iot.solution.model.Repository.Implementation
{
    public class MediaSizeRepository : GenericRepository<Model.MediaSize>, IMediaSizeRepository
    {
        private readonly LogHandler.Logger logger;
        public MediaSizeRepository(IUnitOfWork unitOfWork, LogHandler.Logger logManager) : base(unitOfWork, logManager)
        {
            _uow = unitOfWork;
            logger = logManager;
        }
    }
}