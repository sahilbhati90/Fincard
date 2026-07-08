package com.company.Fincard.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {

    @GetMapping({
            "/app",
            "/app/",
            "/app/login",
            "/app/dashboard",
            "/app/my-banks",
            "/app/transactions",
            "/app/transfer",
            "/app/profile",
            "/app/settings",
            "/app/unauthorized",
            "/app/error/500"
    })
    public String forwardToAngular() {
        return "forward:/app/index.html";
    }
}
