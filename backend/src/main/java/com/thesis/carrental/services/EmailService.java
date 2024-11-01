package com.thesis.carrental.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.Map;

import static com.thesis.carrental.emailing.EmailTemplates.FROM_EMAIL;

@Service
public class EmailService {
    private static final Logger LOG = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private TemplateEngine templateEngine;

    public void send(final String to, final String subject, final String template, final Map<String,Object> variables){
        try{
            Context context = new Context();
            context.setVariables(variables);
            String htmlContent = templateEngine.process(template, context);

            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            helper.setFrom(FROM_EMAIL);
            javaMailSender.send(message);
            LOG.info("Successfully sent email to {} , template: {} , subject: {} ",to,template,subject);
        }catch (MessagingException e){
            LOG.error("Error processing message ",e);
        }
    }
}
