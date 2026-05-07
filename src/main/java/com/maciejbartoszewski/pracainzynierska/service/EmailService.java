package com.maciejbartoszewski.pracainzynierska.service;

import com.maciejbartoszewski.pracainzynierska.model.Expense;
import com.maciejbartoszewski.pracainzynierska.model.Group;
import com.maciejbartoszewski.pracainzynierska.model.Settlement;
import com.maciejbartoszewski.pracainzynierska.model.User;
import com.maciejbartoszewski.pracainzynierska.repository.NotificationPreferenceRepository;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    private final JavaMailSender mailSender;
    private final NotificationPreferenceRepository notificationPreferenceRepository;

    @Async
    public void sendEmail(String to, String subject, String content) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content, true);

            mailSender.send(message);
            log.info("Email sent to: {}", to);
        } catch (Exception e) {
            log.error("Unexpected error while sending email to {}: {}", to, e.getMessage());
        }
    }

    @Async
    public void sendGroupInvitationEmail(User user, Group group) {
        notificationPreferenceRepository.findByUser(user).ifPresent(prefs -> {
            if (Boolean.TRUE.equals(prefs.getNotifyAddedToGroup())) {
                String content =
                        "<p>Cześć " + user.getFirstName() + ",</p>" +
                                "<p>Zostałeś dodany do grupy <strong>" + group.getName() + "</strong>.</p>" +
                                "<p>Pozdrawiamy,<br>Zespół aplikacji</p>";

                sendEmail(
                        user.getEmail(),
                        "Zostałeś dodany do grupy: " + group.getName(),
                        content
                );
            }
        });
    }

    @Async
    public void sendNewExpenseEmail(Expense expense) {
        User creator = expense.getPaidBy();
        Group group = expense.getGroup();

        for (var split : expense.getSplits()) {
            User user = split.getUser();
            if (user.getId().equals(creator.getId())) {
                continue;
            }
            notificationPreferenceRepository.findByUser(user).ifPresent(prefs -> {
                if (Boolean.TRUE.equals(prefs.getNotifyNewExpense())) {
                    String content =
                            "<p>Cześć " + user.getFirstName() + ",</p>" +
                                    "<p>Dodano nowy wydatek w grupie <strong>" + group.getName() + "</strong>.</p>" +
                                    "<p>Kwota do zapłaty: <strong>" + split.getAmount() + " zł</strong>.</p>" +
                                    "<p>Opis: " + expense.getDescription() + "</p>" +
                                    "<p>Pozdrawiamy</p>";

                    sendEmail(
                            user.getEmail(),
                            "Nowy wydatek w grupie: " + group.getName(),
                            content
                    );
                }
            });
        }
    }

    @Async
    public void sendNewSettlementEmail(Settlement settlement) {
        User fromUser = settlement.getFromUser();
        User toUser = settlement.getToUser();
        Group group = settlement.getGroup();

        notificationPreferenceRepository.findByUser(toUser).ifPresent(prefs -> {
            if (Boolean.TRUE.equals(prefs.getNotifyNewSettlement())) {
                String content =
                        "<p>Cześć " + toUser.getFirstName() + ",</p>" +
                                "<p>Użytkownik <strong>" + fromUser.getFirstName() + " " + fromUser.getLastName() + "</strong> spłacił Ci kwotę <strong>" +
                                settlement.getAmount() + " zł</strong> w grupie <strong>" + group.getName() + "</strong>.</p>" +
                                "<p>Pozdrawiamy,<br>Zespół aplikacji</p>";

                sendEmail(
                        toUser.getEmail(),
                        "Otrzymałeś spłatę w grupie: " + group.getName(),
                        content
                );
            }
        });
    }
}