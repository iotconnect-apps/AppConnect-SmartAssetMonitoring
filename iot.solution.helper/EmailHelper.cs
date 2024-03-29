﻿using component.helper.Interface;
using component.logger;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using Response = iot.solution.entity.Response;
using Entity = iot.solution.entity;
using LogHandler = component.services.loghandler;
using System.Reflection;
using System.Net.Http;
using System.Net;
using System.Linq;
using Newtonsoft.Json;
using System.Threading.Tasks;
using System.IO;
using System.Net.Mail;
using System.Text;


namespace component.helper
{
    public class EmailHelper : IEmailHelper
    {
        private readonly LogHandler.Logger _logger;
        private readonly SmtpClient _smtpClient;

        public EmailHelper(LogHandler.Logger logger, SmtpClient smtpClient)
        {
            _logger = logger;
            _smtpClient = smtpClient;
        }

        public async Task SendCompanyRegistrationEmail(string userName, string companyName, string userId, string password,
            string smtpFromDisplayName, string smtpFromMail, string smtpPassword, string smtpRegards, string emailTemplateCompanyRegistrationSubject,
            string emailTemplateCompanyUserList, string emailTemplateImageBaseUrl, string emailTemplateMailSolutionName)
        {
            try
            {
                string subject = emailTemplateCompanyRegistrationSubject;
                string receiver = emailTemplateCompanyUserList;
                string body = string.Empty;
                string templatePath = SolutionConfiguration.UploadBasePath + SolutionConfiguration.EmailTemplatePath;
                using (StreamReader reader = new StreamReader(string.Format(@"{0}\{1}", templatePath, "CompanyRegistartionMail.html")))
                {
                    body = reader.ReadToEnd();
                }

                body = body.Replace("{UserName}", userName.ToString());
                body = body.Replace("{CompanyName}", companyName.ToString());

                body = body.Replace("{UserId}", userId);
                body = body.Replace("{Pwd}", password);
                body = body.Replace("{CurrentYear}", DateTime.Now.Year.ToString());
                body = body.Replace("{Regards}", smtpRegards);
                body = body.Replace("{ImageBaseUrl}", emailTemplateImageBaseUrl);
                body = body.Replace("{MailSolutionName}", emailTemplateMailSolutionName);
                MailMessage mailMessage = new MailMessage
                {
                    From = new MailAddress(smtpFromMail, smtpFromDisplayName),
                    BodyEncoding = Encoding.UTF8,
                    Body = body,
                    Subject = subject,
                    IsBodyHtml = true,
                };
                mailMessage.To.Add(userId);
                if (!string.IsNullOrEmpty(receiver))
                {
                    mailMessage.Bcc.Add(receiver);
                }
                _smtpClient.Send(mailMessage);
            }
            catch (Exception ex)
            {
                _logger.ErrorLog(ex, this.GetType().Name, MethodBase.GetCurrentMethod().Name);
            }
        }

        public async Task SendSubscriptionOverEmail(string userName, string expiryDate, string userEmail,
            string smtpFromDisplayName, string smtpFromMail, string smtpRegards, string emailTemplateImageBaseUrl,
            string emailTemplateSubscriptionExpirySubject, string EmailTemplateSubscriptionExpiryUserList)
        {
            try
            {
                string subject = emailTemplateSubscriptionExpirySubject;
                string receiver = EmailTemplateSubscriptionExpiryUserList;
                string body = string.Empty;
                string templatePath = SolutionConfiguration.UploadBasePath + SolutionConfiguration.EmailTemplatePath;
                using (StreamReader reader = new StreamReader(string.Format(@"{0}\{1}", templatePath, "SubscriptionExpiryMail.html")))
                {
                    body = reader.ReadToEnd();
                }

                body = body.Replace("{UserName}", userName.ToString());
                body = body.Replace("{ExpiryDate}", expiryDate.ToString());
                body = body.Replace("{CurrentYear}", DateTime.Now.Year.ToString());
                body = body.Replace("{Regards}", smtpRegards);
                body = body.Replace("{ImageBaseUrl}", emailTemplateImageBaseUrl);
                MailMessage mailMessage = new MailMessage
                {
                    From = new MailAddress(smtpFromMail, smtpFromDisplayName),
                    BodyEncoding = Encoding.UTF8,
                    Body = body,
                    Subject = subject,
                    IsBodyHtml = true,
                };
                mailMessage.To.Add(userEmail);
                if (!string.IsNullOrEmpty(receiver))
                {
                    mailMessage.Bcc.Add(receiver);
                }
                _smtpClient.Send(mailMessage);
            }
            catch (Exception ex)
            {
                _logger.ErrorLog(ex, this.GetType().Name, MethodBase.GetCurrentMethod().Name);
            }
        }

        public async Task SendCompanyRegistrationAdminEmail(string userName, string companyName, string userId, string address,
            string contactNo, string smtpFromDisplayName, string smtpFromMail, string smtpPassword, string smtpRegards, string emailTemplateCompanyRegistrationSubject,
            string emailTemplateCompanyAdminUserList, string emailTemplateImageBaseUrl)
        {
            try
            {
                string subject = emailTemplateCompanyRegistrationSubject;
                string receiver = emailTemplateCompanyAdminUserList;
                string body = string.Empty;
                string templatePath = SolutionConfiguration.UploadBasePath + SolutionConfiguration.EmailTemplatePath;
                using (StreamReader reader = new StreamReader(string.Format(@"{0}\{1}", templatePath, "CompanyRegistartionAdminMail.html")))
                {
                    body = reader.ReadToEnd();
                }

                body = body.Replace("{UserName}", userName.ToString());
                body = body.Replace("{CompanyName}", companyName.ToString());
                body = body.Replace("{UserId}", userId);
                body = body.Replace("{ContactNo}", contactNo);
                body = body.Replace("{Add}", address);
                body = body.Replace("{CurrentYear}", DateTime.Now.Year.ToString());
                body = body.Replace("{Regards}", smtpRegards);
                body = body.Replace("{ImageBaseUrl}", emailTemplateImageBaseUrl);
                MailMessage mailMessage = new MailMessage
                {
                    From = new MailAddress(smtpFromMail, smtpFromDisplayName),
                    BodyEncoding = Encoding.UTF8,
                    Body = body,
                    Subject = subject,
                    IsBodyHtml = true,
                };
                mailMessage.To.Add(receiver);
                _smtpClient.Send(mailMessage);
            }
            catch (Exception ex)
            {
                _logger.ErrorLog(ex, this.GetType().Name, MethodBase.GetCurrentMethod().Name);
            }
        }
    }
}
