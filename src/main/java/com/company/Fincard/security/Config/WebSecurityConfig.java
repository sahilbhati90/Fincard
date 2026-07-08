package com.company.Fincard.security.Config;

import com.company.Fincard.appuser.AppUserService;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsPasswordService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@AllArgsConstructor
public class WebSecurityConfig {

    private final AppUserService appUserService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    // ================= API SECURITY =================
    @Bean
    @Order(1)
    public SecurityFilterChain apiSecurity(HttpSecurity http) throws Exception {

        http
                .securityMatcher("/api/**")
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                // ✅ Sirf ye genuinely public hain (login se pehle chahiye)
                                "/api/v1/registration",
                                "/api/v1/registration/confirm"
                        ).permitAll()
                        // 🔒 Baaki sab (plaid, dashboard, transfers, transactions) ab authenticated hi honge
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form.disable())
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(
                                (req, res, e) -> res.sendError(401)
                        )
                );

        return http.build();
    }

    // ================= WEB SECURITY =================
    @Bean
    @Order(2)
    public SecurityFilterChain webSecurity(HttpSecurity http) throws Exception {

        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/",
                                "/app/**",
                                "/login",
                                "/login.html",
                                "/register.html",
                                "/Home.html",

                                // STATIC FILES
                                "/style.css",
                                "/script.js",
                                "/Images/**",
                                "/favicon.ico",
                                "/plaid-test.html"
                        ).permitAll()
                        .anyRequest().authenticated()
                )
                .authenticationProvider(authenticationProvider())
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/login.html?logout=true")
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
                );

        return http.build();
    }

    // ================= CORS =================
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:4200"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(appUserService);
        provider.setUserDetailsPasswordService((UserDetailsPasswordService) appUserService);
        provider.setPasswordEncoder(bCryptPasswordEncoder);
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config
    ) throws Exception {
        return config.getAuthenticationManager();
    }
}
