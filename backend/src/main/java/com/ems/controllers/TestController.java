package com.ems.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
    private static final Logger logger = LoggerFactory.getLogger(TestController.class);

    @GetMapping("/hello")
    public ResponseEntity<String> hello() {
        logger.info("ROOT HELLO REACHED");
        return ResponseEntity.ok("Hello from Backend Root");
    }
}
