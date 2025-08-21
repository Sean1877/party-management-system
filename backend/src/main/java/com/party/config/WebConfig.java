package com.party.config;

import com.party.interceptor.OperationLogInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.util.Arrays;

/**
 * Web配置类
 * 配置拦截器、CORS等
 * 
 * @author Party Management System
 * @version 1.0.0
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private OperationLogInterceptor operationLogInterceptor;

    /**
     * 添加拦截器
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 注册操作日志拦截器
        registry.addInterceptor(operationLogInterceptor)
                .addPathPatterns("/api/**") // 拦截所有API请求
                .excludePathPatterns(
                    "/api/auth/login",           // 排除登录接口
                    "/api/auth/logout",          // 排除登出接口
                    "/api/auth/refresh",         // 排除刷新token接口
                    "/api/public/**",            // 排除公共接口
                    "/api/health",               // 排除健康检查
                    "/api/actuator/**"           // 排除监控端点
                );
    }

    /**
     * 配置CORS跨域
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000", "http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}