using host.iot.solution;
using host.iot.solution.Hubs;
using IoT.Solution.SignalR.Clients;
using IoT.Solution.SignalR.Manager;
using IoT.Solution.SignalR.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace iot.solution.host.Controllers
{
    [ApiController]
    [Route("api/notification")]
    public class NotificationController : ControllerBase
    {
        private readonly IHubContext<NotificationHub, INotificationClient> _notificationHub;

        private readonly ISignalRGroupManager _groupManager;
        public NotificationController(IHubContext<NotificationHub,
            INotificationClient> notificationHub,
            ISignalRGroupManager groupManager)
        {
            _notificationHub = notificationHub;
            _groupManager = groupManager;            
        }

        [HttpPost("messages")]
        public async Task Post(NotificationMessage message)
        {
            bool isSent = false;
            try
            {
                if (_groupManager.IsGroupExist(message.Topic))
                {
                    await _notificationHub.Clients.Group(message.Topic).ReceiveMessage(message);
                }
                isSent = true;
            }
            finally
            {
                LogMessages(message, isSent);
            }
        }

        [HttpGet("groups")]
        public IEnumerable<GroupDetail> Groups()
        {
            return _groupManager.GetAllGroups();
        }

        [HttpGet("verify")]
        public IActionResult Verify()
        {
            if (string.IsNullOrWhiteSpace(AppConfig.Version))
                return NotFound();

            return Ok(AppConfig.Version);
        }

        private void LogMessages(NotificationMessage message, bool isSent)
        {
            //bool config = Logger.GetConfiguration(message.Topic);
            //if (!config)
            //    return;
            //if (_groupManager.IsGroupExist(message.Topic))
            //{
            //    if (isSent)
            //        Logger.LogActivity($"Client listener for {message.Topic} is available, message sent");
            //    else
            //        Logger.LogActivity($"Client listener for {message.Topic} is available, failed sending message");
            //}
            //else
            //{
            //    Logger.LogActivity($"Client listener for {message.Topic} is not available, dropping message");
            //}
        }
    }
}
