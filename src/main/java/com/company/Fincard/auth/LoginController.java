package com.company.Fincard.auth;

import com.company.Fincard.appuser.AppUser;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class LoginController {

    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository = new HttpSessionSecurityContextRepository();

    public LoginController(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request,
                                   HttpServletRequest httpRequest,
                                   HttpServletResponse httpResponse) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.get("email"),
                            request.get("password")
                    )
            );

            // Yaha pehle session save nahi ho raha tha - isliye login ke baad bhi
            // agli request unauthenticated aati thi. Ab fix kar diya:
            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(authentication);
            SecurityContextHolder.setContext(context);
            securityContextRepository.saveContext(context, httpRequest, httpResponse);

            AppUser user = (AppUser) authentication.getPrincipal();
            return ResponseEntity.ok(Map.of(
                    "email", user.getEmail(),
                    "fullName", user.getFirstName() + " " + user.getLastName()
            ));

        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }
    }
}