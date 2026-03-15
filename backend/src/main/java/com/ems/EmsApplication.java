package com.ems;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class EmsApplication {

  public static void main(String[] args) {
    SpringApplication.run(EmsApplication.class, args);
  }

  @Bean
  public CommandLineRunner debugRunner() {
    return args -> {
      BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
      String hash = encoder.encode("admin123");
      System.out.println("-------------------------------------------");
      System.out.println("CONFIRMED HASH FOR admin123: " + hash);
      System.out.println("-------------------------------------------");
    };
  }
}
