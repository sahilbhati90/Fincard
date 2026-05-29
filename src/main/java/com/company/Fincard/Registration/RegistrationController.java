package com.company.Fincard.Registration;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path="api/v1/registration")
@AllArgsConstructor
public class RegistrationController {

    private RegistrationService registrationService;
    @PostMapping
    public String register(@RequestBody RegistrationRequest request) {
        System.out.println("Received: " + request);
        return registrationService.register(request);
    }

    // inside RegistrationController class
    @GetMapping(path = "confirm")
    public String confirm(@RequestParam("token") String token) {
        return registrationService.confirmToken(token);
    }


}



















