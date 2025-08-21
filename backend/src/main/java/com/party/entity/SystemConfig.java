package com.party.entity;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * 系统配置实体类
 */
@Entity
@Table(name = "system_configs")
public class SystemConfig {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "config_key", unique = true, nullable = false, length = 100)
    private String configKey;
    
    @Column(name = "config_value", columnDefinition = "TEXT")
    private String configValue;
    
    @Column(name = "config_name", nullable = false, length = 200)
    private String configName;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "value_type", nullable = false)
    private ValueType valueType = ValueType.STRING;
    
    @Column(name = "is_system", nullable = false)
    private Boolean isSystem = false;
    
    @Column(name = "is_encrypted", nullable = false)
    private Boolean isEncrypted = false;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum ValueType {
        STRING,    // 字符串
        INTEGER,   // 整数
        DECIMAL,   // 小数
        BOOLEAN,   // 布尔值
        JSON,      // JSON对象
        DATE,      // 日期
        DATETIME   // 日期时间
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // 构造函数
    public SystemConfig() {}
    
    public SystemConfig(String configKey, String configValue, String configName) {
        this.configKey = configKey;
        this.configValue = configValue;
        this.configName = configName;
    }
    
    public SystemConfig(String configKey, String configValue, String configName, 
                       String description, ValueType valueType) {
        this.configKey = configKey;
        this.configValue = configValue;
        this.configName = configName;
        this.description = description;
        this.valueType = valueType;
    }
    
    // Getter和Setter方法
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getConfigKey() {
        return configKey;
    }
    
    public void setConfigKey(String configKey) {
        this.configKey = configKey;
    }
    
    public String getConfigValue() {
        return configValue;
    }
    
    public void setConfigValue(String configValue) {
        this.configValue = configValue;
    }
    
    public String getConfigName() {
        return configName;
    }
    
    public void setConfigName(String configName) {
        this.configName = configName;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public ValueType getValueType() {
        return valueType;
    }
    
    public void setValueType(ValueType valueType) {
        this.valueType = valueType;
    }
    
    public Boolean getIsSystem() {
        return isSystem;
    }
    
    public void setIsSystem(Boolean isSystem) {
        this.isSystem = isSystem;
    }
    
    public Boolean getIsEncrypted() {
        return isEncrypted;
    }
    
    public void setIsEncrypted(Boolean isEncrypted) {
        this.isEncrypted = isEncrypted;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    /**
     * 获取布尔值类型的配置值
     * @return 布尔值
     */
    public Boolean getBooleanValue() {
        if (configValue == null) {
            return null;
        }
        return Boolean.parseBoolean(configValue);
    }
    
    /**
     * 获取整数类型的配置值
     * @return 整数值
     */
    public Integer getIntegerValue() {
        if (configValue == null) {
            return null;
        }
        try {
            return Integer.parseInt(configValue);
        } catch (NumberFormatException e) {
            return null;
        }
    }
    
    /**
     * 获取长整数类型的配置值
     * @return 长整数值
     */
    public Long getLongValue() {
        if (configValue == null) {
            return null;
        }
        try {
            return Long.parseLong(configValue);
        } catch (NumberFormatException e) {
            return null;
        }
    }
    
    /**
     * 获取双精度浮点数类型的配置值
     * @return 双精度浮点数值
     */
    public Double getDoubleValue() {
        if (configValue == null) {
            return null;
        }
        try {
            return Double.parseDouble(configValue);
        } catch (NumberFormatException e) {
            return null;
        }
    }
    
    /**
     * 检查是否为系统配置
     * @return 是否为系统配置
     */
    public boolean isSystemConfig() {
        return Boolean.TRUE.equals(isSystem);
    }
    
    /**
     * 检查是否为加密配置
     * @return 是否为加密配置
     */
    public boolean isEncryptedConfig() {
        return Boolean.TRUE.equals(isEncrypted);
    }
    
    @Override
    public String toString() {
        return "SystemConfig{" +
                "id=" + id +
                ", configKey='" + configKey + '\'' +
                ", configName='" + configName + '\'' +
                ", valueType=" + valueType +
                ", isSystem=" + isSystem +
                ", isEncrypted=" + isEncrypted +
                '}';
    }
}