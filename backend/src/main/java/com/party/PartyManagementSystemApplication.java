package com.party;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * 党建管理系统主启动类
 * 
 * @author Party Management System
 * @version 1.0.0
 */
@SpringBootApplication
@EnableJpaAuditing
@EnableCaching
public class PartyManagementSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(PartyManagementSystemApplication.class, args);
        System.out.println("\n" +
                "██████╗  █████╗ ██████╗ ████████╗██╗   ██╗    ███╗   ███╗ ██████╗ ███╗   ███╗████████╗\n" +
                "██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝╚██╗ ██╔╝    ████╗ ████║██╔════╝ ████╗ ████║╚══██╔══╝\n" +
                "██████╔╝███████║██████╔╝   ██║    ╚████╔╝     ██╔████╔██║██║  ███╗██╔████╔██║   ██║   \n" +
                "██╔═══╝ ██╔══██║██╔══██╗   ██║     ╚██╔╝      ██║╚██╔╝██║██║   ██║██║╚██╔╝██║   ██║   \n" +
                "██║     ██║  ██║██║  ██║   ██║      ██║       ██║ ╚═╝ ██║╚██████╔╝██║ ╚═╝ ██║   ██║   \n" +
                "╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝      ╚═╝       ╚═╝     ╚═╝ ╚═════╝ ╚═╝     ╚═╝   ╚═╝   \n" +
                "\n党建管理系统启动成功！\n" +
                "访问地址: http://localhost:8080\n" +
                "API文档: http://localhost:8080/swagger-ui.html\n");
    }
}