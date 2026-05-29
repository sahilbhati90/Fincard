package com.company.Fincard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class FincardApplication {

	public static void main(String[] args) {
		SpringApplication.run(FincardApplication.class, args);
		System.out.println("Spring boot application Started");
	}
}
