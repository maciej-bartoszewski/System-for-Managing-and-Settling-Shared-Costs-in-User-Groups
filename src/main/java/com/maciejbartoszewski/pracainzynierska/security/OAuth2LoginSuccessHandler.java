package com.maciejbartoszewski.pracainzynierska.security;

import com.maciejbartoszewski.pracainzynierska.enums.AuthProvider;
import com.maciejbartoszewski.pracainzynierska.enums.Role;
import com.maciejbartoszewski.pracainzynierska.model.User;
import com.maciejbartoszewski.pracainzynierska.repository.UserRepository;
import com.maciejbartoszewski.pracainzynierska.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final UserService userService;
    private final UserRepository userRepository;
    private final AuthCodeService authCodeService;

    @Value("${app.oauth2.redirectUri}")
    private String frontendRedirectUri;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        OAuth2User o = (OAuth2User) authentication.getPrincipal();
        String email = o.getAttribute("email");
        String givenName = o.getAttribute("given_name");
        String familyName = o.getAttribute("family_name");

        Integer userId;
        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(email);
        if (userOpt.isPresent()) {
            userId = userOpt.get().getId();
        } else {
            userService.createUser(givenName, familyName, email, null, Role.USER, AuthProvider.GOOGLE);
            userId = userRepository.findByEmailIgnoreCase(email).orElseThrow(() -> new UsernameNotFoundException("User not found")).getId();
        }

        String authCode = authCodeService.generateCode(userId);

        String redirectUrl = UriComponentsBuilder.fromUriString(frontendRedirectUri)
                .queryParam("code", authCode)
                .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}