using iot.solution.model.Repository.Interface;
using Model = iot.solution.model.Models;
using LogHandler = component.services.loghandler;
namespace iot.solution.model.Repository.Implementation
{
    public class MediaDetailRepository : GenericRepository<Model.MediaDetail>, IMediaDetailRepository
    {
        private readonly LogHandler.Logger logger;
        public MediaDetailRepository(IUnitOfWork unitOfWork, LogHandler.Logger logManager) : base(unitOfWork, logManager)
        {
            _uow = unitOfWork;
            logger = logManager;
        }
    }
}