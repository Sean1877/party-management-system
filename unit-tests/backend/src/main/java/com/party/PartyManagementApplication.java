package com.party;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan("com.party.entity")
@EnableJpaRepositories("com.party.repository")
public class PartyManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(PartyManagementApplication.class, args);
    }

}