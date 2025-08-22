package com.party.common.config;

/**
 * 系统配置常量
 * 
 * @author Party Management System
 * @version 1.0.0
 */
public class SystemConfig {
    
    // 默认密码
    public static final String DEFAULT_PASSWORD = "123456";
    
    // 分页默认值
    public static final int DEFAULT_PAGE_SIZE = 10;
    public static final int DEFAULT_PAGE_NUMBER = 0;
    
    // 时间格式
    public static final String DATE_FORMAT = "yyyy-MM-dd";
    public static final String DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
    
    // CORS配置
    public static final String[] ALLOWED_ORIGINS = {
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8080"
    };
    
    // JWT配置
    public static final String JWT_SECRET = "party-management-system-secret-key";
    public static final long JWT_EXPIRATION = 86400000; // 24小时
    
    // 文件上传配置
    public static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    public static final String[] ALLOWED_FILE_TYPES = {
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    };
    
    // 活动相关配置
    public static final int MAX_PARTICIPANTS = 1000;
    public static final int ACTIVITY_REMINDER_DAYS_BEFORE = 3;
    
    // 用户相关配置
    public static final int MAX_LOGIN_ATTEMPTS = 5;
    public static final long ACCOUNT_LOCK_DURATION = 30 * 60 * 1000; // 30分钟
    
    // 系统信息
    public static final String SYSTEM_NAME = "党建管理系统";
    public static final String SYSTEM_VERSION = "1.0.0";
}