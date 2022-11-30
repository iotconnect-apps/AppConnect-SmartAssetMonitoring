using System.Collections.Generic;
using System.Threading.Tasks;
namespace component.helper.Interface
{
    public interface IEmailHelper
    {
        Task SendCompanyRegistrationEmail(string userName, string companyName, string userId, string password,
            string smtpFromDisplayName, string smtpFromMail, string smtpPassword, string smtpRegards, string emailTemplateCompanyRegistrationSubject,
            string emailTemplateCompanyUserList, string emailTemplateImageBaseUrl, string emailTemplateMailSolutionName);
        Task SendSubscriptionOverEmail(string userName, string expiryDate, string userEmail,
            string smtpFromDisplayName, string smtpFromMail, string smtpRegards, string emailTemplateImageBaseUrl,
            string emailTemplateSubscriptionExpirySubject, string EmailTemplateSubscriptionExpiryUserList);
        Task SendCompanyRegistrationAdminEmail(string userName, string companyName, string userId, string address, string contactNo,
            string smtpFromDisplayName, string smtpFromMail, string smtpPassword, string smtpRegards, string emailTemplateCompanyRegistrationSubject,
            string emailTemplateCompanyAdminUserList, string emailTemplateImageBaseUrl);
    }
}
