package com.company.Fincard.appuser.email;

import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class EmailService implements EmailSender {

    private final JavaMailSender mailSender;
    private static final Logger LOGGER = LoggerFactory.getLogger(EmailService.class);

    @Async
    @Override
    public void send(String to, String email) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, "utf-8");
            helper.setText(email, true);
            helper.setTo(to);
            helper.setSubject("Confirm your email");

            // FROM must be a syntactically valid email. Display name optional.
            helper.setFrom(new InternetAddress("no-reply@localhost", "Fincard"));

            mailSender.send(message);
        } catch (Exception e) {
            LOGGER.error("Failed to send email", e);
            throw new IllegalStateException("failed to send email");
        }
    }
}