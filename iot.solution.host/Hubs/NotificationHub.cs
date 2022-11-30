
using IoT.Solution.SignalR.Clients;
using IoT.Solution.SignalR.Manager;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace host.iot.solution.Hubs
{
    public class NotificationHub : Hub<INotificationClient>
    {
        private readonly ISignalRGroupManager _groupManager;
        public NotificationHub(ISignalRGroupManager groupManager)
        {
            _groupManager = groupManager;
        }
        private string GroupName
        {
            get
            {
                return Context.GetHttpContext()?.Request?.Query["groupName"];
            }
        }

        public override Task OnConnectedAsync()
        {
            string error = null;
            try
            {
                if (!string.IsNullOrWhiteSpace(GroupName))
                {
                    Groups.AddToGroupAsync(Context.ConnectionId, GroupName);
                    _groupManager.AddToGroupAsync(Context.ConnectionId, GroupName);
                }
                return base.OnConnectedAsync();
            }
            catch (Exception ex)
            {
                error = ex.StackTrace + Environment.NewLine + ex.Message;
                return Task.CompletedTask;
            }
            finally
            {
                LogActivity(true, !string.IsNullOrEmpty(error), GroupName, error);
            }
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            string error = null;
            try
            {
                if (!string.IsNullOrWhiteSpace(GroupName))
                {
                    Groups.RemoveFromGroupAsync(Context.ConnectionId, GroupName);
                    _groupManager.RemoveFromGroupAsync(Context.ConnectionId, GroupName);
                }
                return base.OnDisconnectedAsync(exception);
            }
            catch (Exception ex)
            {
                error = ex.StackTrace + Environment.NewLine + ex.Message;
                return Task.CompletedTask;
            }
            finally
            {
                LogActivity(false, !string.IsNullOrEmpty(error), GroupName, error);
            }
        }

        private void LogActivity(bool connect, bool isError, string topic, string error = "")
        {
            //bool config = Logger.GetConfiguration(topic);
            //if (!config)
            //    return;

            //if (connect)
            //{
            //    if (!isError)
            //        Logger.LogActivity($"Client connected with topic {GroupName} and connectionId {Context.ConnectionId}");
            //    else
            //        Logger.LogActivity($"Client connection failed with topic {GroupName} and connectionId {Context.ConnectionId} and error {error}");
            //}
            //else
            //{
            //    if (!isError)
            //        Logger.LogActivity($"Client disconnected with topic {GroupName} and connectionId {Context.ConnectionId}");
            //    else
            //        Logger.LogActivity($"Client connection failed with topic {GroupName} and connectionId {Context.ConnectionId} and error {error}");
            //}
        }
    }
}
