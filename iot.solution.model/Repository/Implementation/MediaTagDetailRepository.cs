
using iot.solution.model.Repository.Interface;
using Model = iot.solution.model.Models;
using LogHandler = component.services.loghandler;
namespace iot.solution.model.Repository.Implementation
{
    public class MediaTagDetailRepository : GenericRepository<Model.MediaTagDetail>, IMediaTagDetailRepository
    {
        private readonly LogHandler.Logger logger;
        public MediaTagDetailRepository(IUnitOfWork unitOfWork, LogHandler.Logger logManager) : base(unitOfWork, logManager)
        {
            _uow = unitOfWork;
            logger = logManager;
        }
    }
}