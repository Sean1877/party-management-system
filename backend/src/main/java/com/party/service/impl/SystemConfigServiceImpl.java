package com.party.service.impl;

import com.party.entity.SystemConfig;
import com.party.repository.SystemConfigRepository;
import com.party.service.OperationLogService;
import com.party.service.SystemConfigService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import javax.persistence.EntityNotFoundException;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import java.util.Comparator;
import org.springframework.data.domain.PageImpl;

/**
 * 系统配置管理服务实现类
 */
@Service
@Transactional
public class SystemConfigServiceImpl implements SystemConfigService {
    
    @Autowired
    private SystemConfigRepository systemConfigRepository;
    
    @Autowired
    private OperationLogService operationLogService;
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    // ==================== 基础CRUD操作 ====================
    
    @Override
    public SystemConfig createConfig(SystemConfig config) {
        // 检查配置键是否已存在
        if (systemConfigRepository.existsByConfigKey(config.getConfigKey())) {
            throw new IllegalArgumentException("配置键已存在: " + config.getConfigKey());
        }
        
        SystemConfig saved = systemConfigRepository.save(config);
        operationLogService.log("CREATE_CONFIG", "SystemConfig", "创建配置: " + config.getConfigKey());
        return saved;
    }
    
    @Override
    public SystemConfig updateConfig(Long id, SystemConfig config) {
        SystemConfig existing = systemConfigRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("配置不存在: " + id));
        
        // 检查是否为系统配置
        if (existing.getIsSystem() && !config.getIsSystem()) {
            throw new IllegalArgumentException("不能修改系统配置的系统标识");
        }
        
        existing.setConfigValue(config.getConfigValue());
        existing.setConfigName(config.getConfigName());
        existing.setDescription(config.getDescription());
        existing.setValueType(config.getValueType());
        existing.setIsEncrypted(config.getIsEncrypted());
        
        SystemConfig updated = systemConfigRepository.save(existing);
        operationLogService.log("UPDATE_CONFIG", "SystemConfig", "更新配置: " + existing.getConfigKey());
        return updated;
    }
    
    @Override
    public void deleteConfig(Long id) {
        SystemConfig config = systemConfigRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("配置不存在: " + id));
        
        // 检查是否为系统配置
        if (config.getIsSystem()) {
            throw new IllegalArgumentException("不能删除系统配置: " + config.getConfigKey());
        }
        
        systemConfigRepository.deleteById(id);
        operationLogService.log("DELETE_CONFIG", "SystemConfig", "删除配置: " + config.getConfigKey());
    }
    
    @Override
    @Transactional(readOnly = true)
    public SystemConfig getConfigById(Long id) {
        return systemConfigRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("配置不存在: " + id));
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<SystemConfig> getConfigs(Pageable pageable) {
        return systemConfigRepository.findAll(pageable);
    }
    
    // ==================== 按键查询 ====================
    
    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "systemConfig", key = "#key")
    public SystemConfig getConfigByKey(String key) {
        return systemConfigRepository.findByConfigKey(key)
            .orElseThrow(() -> new EntityNotFoundException("配置不存在: " + key));
    }
    
    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "configValue", key = "#key")
    public String getConfigValue(String key) {
        return systemConfigRepository.findByConfigKey(key)
            .map(SystemConfig::getConfigValue)
            .orElse(null);
    }
    
    @Override
    @Transactional(readOnly = true)
    public String getConfigValue(String configKey, String defaultValue) {
        String value = getConfigValue(configKey);
        return value != null ? value : defaultValue;
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<SystemConfig> getConfigsByKeyPrefix(String keyPrefix) {
        return systemConfigRepository.findByConfigKeyStartingWith(keyPrefix);
    }
    
    // ==================== 按类型查询 ====================
    
    @Transactional(readOnly = true)
    public List<SystemConfig> getConfigsByValueType(SystemConfig.ValueType valueType) {
        return systemConfigRepository.findByValueType(valueType);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<SystemConfig> getUserVisibleConfigs() {
        return systemConfigRepository.findUserVisibleConfigs();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<SystemConfig> getSystemConfigs() {
        return systemConfigRepository.findAll().stream()
                .filter(SystemConfig::getIsSystem)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<SystemConfig> getEncryptedConfigs() {
        return systemConfigRepository.findAll().stream()
                .filter(SystemConfig::getIsEncrypted)
                .collect(Collectors.toList());
    }
    
    // ==================== 设置配置值 ====================
    
    @Override
    @CacheEvict(value = {"systemConfig", "configValue"}, key = "#configKey")
    public SystemConfig setConfigValue(String configKey, String configValue) {
        SystemConfig config = systemConfigRepository.findByConfigKey(configKey)
            .orElse(new SystemConfig());
        
        if (config.getId() == null) {
            // 新建配置
            config.setConfigKey(configKey);
            config.setConfigName(configKey);
            config.setValueType(SystemConfig.ValueType.STRING);
            config.setIsSystem(false);
            config.setIsEncrypted(false);
        }
        
        config.setConfigValue(configValue);
        SystemConfig savedConfig = systemConfigRepository.save(config);
        
        operationLogService.log("SET_CONFIG_VALUE", "SystemConfig", "设置配置值: " + configKey);
        return savedConfig;
    }
    
    @Override
    @CacheEvict(value = {"systemConfig", "configValue"}, key = "#configKey")
    public SystemConfig setConfigValue(String configKey, String configValue, String configName, String description) {
        SystemConfig config = systemConfigRepository.findByConfigKey(configKey)
            .orElse(new SystemConfig());
        
        if (config.getId() == null) {
            // 新建配置
            config.setConfigKey(configKey);
            config.setConfigName(configName != null ? configName : configKey);
            config.setValueType(SystemConfig.ValueType.STRING);
            config.setIsSystem(false);
            config.setIsEncrypted(false);
        }
        
        config.setConfigValue(configValue);
        config.setDescription(description);
        SystemConfig savedConfig = systemConfigRepository.save(config);
        
        operationLogService.log("SET_CONFIG_VALUE", "SystemConfig", "设置配置值: " + configKey);
        return savedConfig;
    }
    
    @Override
    @CacheEvict(value = {"systemConfig", "configValue"}, allEntries = true)
    public Map<String, Boolean> setConfigValues(Map<String, String> configMap) {
        Map<String, Boolean> result = new HashMap<>();
        for (Map.Entry<String, String> entry : configMap.entrySet()) {
            try {
                setConfigValue(entry.getKey(), entry.getValue());
                result.put(entry.getKey(), true);
            } catch (Exception e) {
                result.put(entry.getKey(), false);
            }
        }
        
        operationLogService.log("SET_BATCH_CONFIGS", "SystemConfig", "批量设置 " + configMap.size() + " 个配置");
        return result;
    }
    
    // ==================== 删除配置 ====================
    
    @Override
    @CacheEvict(value = {"systemConfig", "configValue"}, key = "#key")
    public void deleteConfigByKey(String key) {
        SystemConfig config = systemConfigRepository.findByConfigKey(key)
            .orElseThrow(() -> new EntityNotFoundException("配置不存在: " + key));
        
        if (config.getIsSystem()) {
            throw new IllegalArgumentException("不能删除系统配置: " + key);
        }
        
        systemConfigRepository.delete(config);
        operationLogService.log("DELETE_CONFIG_BY_KEY", "SystemConfig", "删除配置: " + key);
    }
    
    // ==================== 类型转换 ====================
    
    @Override
    @Transactional(readOnly = true)
    public String getStringValue(String key, String defaultValue) {
        String value = getConfigValue(key);
        return value != null ? value : defaultValue;
    }
    
    @Override
    @Transactional(readOnly = true)
    public Integer getIntValue(String key, Integer defaultValue) {
        String value = getConfigValue(key);
        if (value == null) {
            return defaultValue;
        }
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public Long getLongValue(String key, Long defaultValue) {
        String value = getConfigValue(key);
        if (value == null) {
            return defaultValue;
        }
        try {
            return Long.parseLong(value);
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public Double getDoubleValue(String key, Double defaultValue) {
        String value = getConfigValue(key);
        if (value == null) {
            return defaultValue;
        }
        try {
            return Double.parseDouble(value);
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public Boolean getBooleanValue(String key, Boolean defaultValue) {
        String value = getConfigValue(key);
        if (value == null) {
            return defaultValue;
        }
        return Boolean.parseBoolean(value);
    }
    
    @Override
    @Transactional(readOnly = true)
    public <T> T getJsonValue(String configKey, Class<T> clazz) {
        String value = getConfigValue(configKey);
        if (value == null) {
            return null;
        }
        try {
            return objectMapper.readValue(value, clazz);
        } catch (JsonProcessingException e) {
            return null;
        }
    }
    
    // ==================== 验证功能 ====================
    
    @Override
    @Transactional(readOnly = true)
    public boolean validateConfigValue(String configKey, String configValue, SystemConfig.ValueType valueType) {
        if (configValue == null) {
            return true; // 空值认为是有效的
        }
        
        try {
            switch (valueType) {
                case INTEGER:
                    Integer.parseInt(configValue);
                    break;
                case DECIMAL:
                    Double.parseDouble(configValue);
                    break;
                case BOOLEAN:
                    // Boolean.parseBoolean 不会抛出异常，需要手动检查
                    if (!"true".equalsIgnoreCase(configValue) && !"false".equalsIgnoreCase(configValue)) {
                        return false;
                    }
                    break;
                case JSON:
                    objectMapper.readTree(configValue);
                    break;
                case DATE:
                case DATETIME:
                    // 可以添加日期格式验证
                    break;
                case STRING:
                default:
                    // 字符串类型总是有效的
                    break;
            }
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean existsByConfigKey(String configKey) {
        return systemConfigRepository.existsByConfigKey(configKey);
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean isSystemConfig(String configKey) {
        return systemConfigRepository.findByConfigKey(configKey)
            .map(SystemConfig::getIsSystem)
            .orElse(false);
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean isEncryptedConfig(String configKey) {
        return systemConfigRepository.findByConfigKey(configKey)
            .map(SystemConfig::getIsEncrypted)
            .orElse(false);
    }
    
    // ==================== 搜索功能 ====================
    
    @Transactional(readOnly = true)
    public List<SystemConfig> searchConfigs(String keyword) {
        return systemConfigRepository.findAll().stream()
                .filter(config -> config.getConfigKey().toLowerCase().contains(keyword.toLowerCase()) ||
                                (config.getConfigName() != null && config.getConfigName().toLowerCase().contains(keyword.toLowerCase())) ||
                                (config.getDescription() != null && config.getDescription().toLowerCase().contains(keyword.toLowerCase())))
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<SystemConfig> searchByConfigName(String configName) {
        return systemConfigRepository.findAll().stream()
                .filter(config -> config.getConfigName() != null && 
                                config.getConfigName().toLowerCase().contains(configName.toLowerCase()))
                .collect(Collectors.toList());
    }
    
    // ==================== 统计功能 ====================
    
    public Map<String, Object> getSystemStatistics() {
        Map<String, Object> statistics = new HashMap<>();
        
        // 总配置数量
        long totalConfigs = systemConfigRepository.count();
        statistics.put("totalConfigs", totalConfigs);
        
        // 系统配置数量
        long systemConfigCount = systemConfigRepository.findAll().stream()
            .mapToLong(config -> config.getIsSystem() ? 1L : 0L)
            .sum();
        statistics.put("systemConfigs", systemConfigCount);
        
        // 加密配置数量
        long encryptedConfigCount = 0L;
        statistics.put("encryptedConfigs", encryptedConfigCount);
        
        // 字符串类型配置数量
        long stringConfigCount = 0L;
        statistics.put("stringConfigs", stringConfigCount);
        
        // 最近更新时间
        Optional<SystemConfig> recentConfig = systemConfigRepository.findAll().stream()
            .max(Comparator.comparing(SystemConfig::getUpdatedAt));
        recentConfig.ifPresent(config -> statistics.put("lastUpdated", config.getUpdatedAt()));
        
        return statistics;
    }
    
    @Override
    public long countUserConfigs() {
        return systemConfigRepository.countUserConfigs();
    }
    
    @Override
    public long countSystemConfigs() {
        return systemConfigRepository.findAll().stream()
            .filter(SystemConfig::getIsSystem)
            .count();
    }
    
    @Override
    public long countAllConfigs() {
        return systemConfigRepository.count();
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<SystemConfig> searchConfigs(String keyword, Pageable pageable) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return systemConfigRepository.findAll(pageable);
        }
        List<SystemConfig> configs = systemConfigRepository.searchConfigs(keyword);
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), configs.size());
        List<SystemConfig> pageContent = configs.subList(start, end);
        return new PageImpl<>(pageContent, pageable, configs.size());
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, String> getConfigValues(List<String> configKeys) {
        List<Object[]> results = systemConfigRepository.findConfigValues(configKeys);
        Map<String, String> configMap = new HashMap<>();
        for (Object[] result : results) {
            String key = (String) result[0];
            String value = (String) result[1];
            configMap.put(key, value);
        }
        return configMap;
    }
    
    @Override
    public Map<SystemConfig.ValueType, Long> countConfigsByValueType() {
        return systemConfigRepository.findAll().stream()
            .collect(Collectors.groupingBy(
                SystemConfig::getValueType,
                Collectors.counting()
            ));
    }
    @Override
    public List<SystemConfig> getRecentlyUpdatedConfigs(int limit) {
        return systemConfigRepository.findAll().stream()
                .sorted(Comparator.comparing(SystemConfig::getUpdatedAt).reversed())
                .limit(limit > 0 ? limit : 10)
                .collect(Collectors.toList());
    }
    
    // ==================== 导入导出功能 ====================
    
    @Override
    @CacheEvict(value = {"systemConfig", "configValue"}, allEntries = true)
    public Map<String, Object> importConfigs(String filePath, boolean overwriteExisting) {
        try {
            File importFile = new File(filePath);
            if (!importFile.exists()) {
                throw new IllegalArgumentException("导入文件不存在: " + filePath);
            }
            
            @SuppressWarnings("unchecked")
            Map<String, String> configs = objectMapper.readValue(importFile, Map.class);
        int successCount = 0;
        int failCount = 0;
        List<String> errors = new ArrayList<>();
        
            for (Map.Entry<String, String> entry : configs.entrySet()) {
                try {
                    String key = entry.getKey();
                    String value = entry.getValue();
                    
                    Optional<SystemConfig> existingConfig = systemConfigRepository.findByConfigKey(key);
                    if (existingConfig.isPresent() && !overwriteExisting) {
                        // 跳过已存在的配置
                        continue;
                    }
                    
                    setConfigValue(key, value);
                    successCount++;
                } catch (Exception e) {
                    failCount++;
                    errors.add(entry.getKey() + ": " + e.getMessage());
                }
            }
        
        Map<String, Object> result = new HashMap<>();
        result.put("totalCount", configs.size());
        result.put("successCount", successCount);
        result.put("failCount", failCount);
        result.put("errors", errors);
        
            operationLogService.log("IMPORT_CONFIGS", "SystemConfig", "导入 " + configs.size() + " 个配置，成功 " + successCount + " 个");
            
            return result;
        } catch (IOException e) {
            throw new RuntimeException("导入配置失败: " + e.getMessage(), e);
        }
    }
    
    @Override
    public String exportConfigs(boolean includeSystemConfigs, boolean includeEncryptedConfigs) {
        List<SystemConfig> configs = systemConfigRepository.findAll();
        
        // 过滤配置
        configs = configs.stream()
            .filter(config -> includeSystemConfigs || !config.getIsSystem())
            .filter(config -> includeEncryptedConfigs || !config.getIsEncrypted())
            .collect(Collectors.toList());
        
        // 生成导出文件
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String fileName = "system_configs_" + timestamp + ".json";
        String filePath = System.getProperty("java.io.tmpdir") + File.separator + fileName;
        
        try {
            Map<String, String> exportData = configs.stream()
                .collect(Collectors.toMap(
                    SystemConfig::getConfigKey,
                    SystemConfig::getConfigValue,
                    (existing, replacement) -> existing
                ));
            
            objectMapper.writeValue(new File(filePath), exportData);
            
            operationLogService.log("EXPORT_CONFIGS", "SystemConfig", "导出 " + configs.size() + " 个配置到文件: " + fileName);
            
            return filePath;
        } catch (IOException e) {
            throw new RuntimeException("导出配置失败: " + e.getMessage(), e);
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public String backupConfigs() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String fileName = "system_configs_backup_" + timestamp + ".json";
        String backupPath = System.getProperty("java.io.tmpdir") + File.separator + "backups" + File.separator + fileName;
        
        try {
            // 创建备份目录
            Path backupDir = Paths.get(System.getProperty("java.io.tmpdir"), "backups");
            Files.createDirectories(backupDir);
            
            List<SystemConfig> allConfigs = systemConfigRepository.findAll();
            objectMapper.writeValue(new File(backupPath), allConfigs);
            
            operationLogService.log("BACKUP_CONFIGS", "SystemConfig", "备份 " + allConfigs.size() + " 个配置到文件: " + fileName);
            
            return backupPath;
        } catch (IOException e) {
            throw new RuntimeException("备份配置失败: " + e.getMessage(), e);
        }
    }
    
    @Override
    @CacheEvict(value = {"systemConfig", "configValue"}, allEntries = true)
    public Map<String, Object> restoreConfigs(String backupPath) {
        try {
            File backupFile = new File(backupPath);
            if (!backupFile.exists()) {
                throw new IllegalArgumentException("备份文件不存在: " + backupPath);
            }
            
            SystemConfig[] configs = objectMapper.readValue(backupFile, SystemConfig[].class);
            
            int successCount = 0;
            int failCount = 0;
            List<String> errors = new ArrayList<>();
            
            for (SystemConfig config : configs) {
                try {
                    // 重置ID，让JPA自动生成
                    config.setId(null);
                    systemConfigRepository.save(config);
                    successCount++;
                } catch (Exception e) {
                    failCount++;
                    errors.add(config.getConfigKey() + ": " + e.getMessage());
                }
            }
            
            Map<String, Object> result = new HashMap<>();
            result.put("totalCount", configs.length);
            result.put("successCount", successCount);
            result.put("failCount", failCount);
            result.put("errors", errors);
            
            operationLogService.log("RESTORE_CONFIGS", "SystemConfig", "从备份恢复 " + configs.length + " 个配置，成功 " + successCount + " 个");
            
            return result;
        } catch (IOException e) {
            throw new RuntimeException("恢复配置失败: " + e.getMessage(), e);
        }
    }
    
    // ==================== 缓存管理 ====================
    
    @Override
    public void refreshConfigCache() {
        operationLogService.log("REFRESH_CONFIG_CACHE", "SystemConfig", "刷新配置缓存");
    }
    
    @Override
    public void refreshConfigCache(String configKey) {
        // 刷新指定配置的缓存
        // 这里可以添加指定配置的缓存刷新逻辑
    }
    
    @Override
    public void clearConfigCache() {
        operationLogService.log("CLEAR_CONFIG_CACHE", "SystemConfig", "清空配置缓存");
    }
    
    // ==================== 初始化功能 ====================
    
    @Override
    public void initializeDefaultConfigs() {
        Map<String, String> defaultConfigs = getDefaultConfigs();
        int created = 0;
        int updated = 0;
        
        for (Map.Entry<String, String> entry : defaultConfigs.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();
            
            Optional<SystemConfig> existingConfig = systemConfigRepository.findByConfigKey(key);
            if (existingConfig.isPresent()) {
                // 更新现有配置
                SystemConfig config = existingConfig.get();
                if (!value.equals(config.getConfigValue())) {
                    config.setConfigValue(value);
                    config.setUpdatedAt(LocalDateTime.now());
                    systemConfigRepository.save(config);
                    updated++;
                }
            } else {
                // 创建新配置
                SystemConfig config = new SystemConfig();
                config.setConfigKey(key);
                config.setConfigValue(value);
                config.setConfigName(key); // 使用key作为默认名称
                config.setDescription("系统默认配置");
                config.setValueType(SystemConfig.ValueType.STRING);
                config.setIsSystem(true);
                config.setIsEncrypted(false);
                config.setCreatedAt(LocalDateTime.now());
                config.setUpdatedAt(LocalDateTime.now());
                systemConfigRepository.save(config);
                created++;
            }
        }
        
        operationLogService.log("INIT_DEFAULT_CONFIGS", "SystemConfig", 
            String.format("初始化默认配置: 创建%d个, 更新%d个", created, updated));
    }
    
    @Override
    public void checkAndCreateRequiredConfigs() {
        Map<String, String> defaultConfigs = getDefaultConfigs();
        
        int createdCount = 0;
        
        for (Map.Entry<String, String> entry : defaultConfigs.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();
            
            if (!systemConfigRepository.existsByConfigKey(key)) {
                SystemConfig config = new SystemConfig();
                config.setConfigKey(key);
                config.setConfigValue(value);
                config.setConfigName(getDefaultConfigName(key));
                config.setDescription(getDefaultConfigDescription(key));
                config.setValueType(getDefaultConfigType(key));
                config.setIsSystem(true);
                config.setIsEncrypted(isDefaultConfigEncrypted(key));
                config.setCreatedAt(LocalDateTime.now());
                config.setUpdatedAt(LocalDateTime.now());
                
                systemConfigRepository.save(config);
                createdCount++;
            }
        }
        
        operationLogService.log("CHECK_REQUIRED_CONFIGS", "SystemConfig", 
            String.format("检查并创建必需配置: 创建%d个", createdCount));
    }
    
    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getSystemInfo() {
        Map<String, Object> systemInfo = new HashMap<>();
        
        systemInfo.put("systemName", getStringValue("system.name", "党建管理系统"));
        systemInfo.put("systemVersion", getStringValue("system.version", "1.0.0"));
        systemInfo.put("systemDescription", getStringValue("system.description", "党建管理系统"));
        systemInfo.put("maxFileSize", getLongValue("system.max.file.size", 10485760L)); // 10MB
        systemInfo.put("sessionTimeout", getIntValue("system.session.timeout", 3600)); // 1小时
        systemInfo.put("enableRegistration", getBooleanValue("system.enable.registration", true));
        systemInfo.put("enableEmailNotification", getBooleanValue("system.enable.email.notification", false));
        
        return systemInfo;
    }
    
    // ==================== 私有辅助方法 ====================
    
    /**
     * 获取默认配置
     */
    private Map<String, String> getDefaultConfigs() {
        Map<String, String> configs = new HashMap<>();
        
        // 系统基础配置
        configs.put("system.name", "党建管理系统");
        configs.put("system.version", "1.0.0");
        configs.put("system.description", "党建管理系统");
        configs.put("system.max.file.size", "10485760"); // 10MB
        configs.put("system.session.timeout", "3600"); // 1小时
        configs.put("system.enable.registration", "true");
        configs.put("system.enable.email.notification", "false");
        
        // 党费相关配置
        configs.put("fee.default.rate", "0.005"); // 默认党费比例 0.5%
        configs.put("fee.min.amount", "0.20"); // 最低党费金额
        configs.put("fee.max.amount", "1000.00"); // 最高党费金额
        configs.put("fee.payment.deadline.day", "10"); // 每月缴费截止日期
        configs.put("fee.overdue.reminder.days", "7"); // 逾期提醒天数
        
        // 安全配置
        configs.put("security.password.min.length", "8");
        configs.put("security.password.max.attempts", "5");
        configs.put("security.session.max.concurrent", "1");
        
        // 邮件配置
        configs.put("email.smtp.host", "");
        configs.put("email.smtp.port", "587");
        configs.put("email.smtp.username", "");
        configs.put("email.smtp.password", "");
        configs.put("email.from.address", "");
        configs.put("email.from.name", "党建管理系统");
        
        return configs;
    }
    
    /**
     * 获取默认配置名称
     */
    private String getDefaultConfigName(String key) {
        Map<String, String> names = new HashMap<>();
        names.put("system.name", "系统名称");
        names.put("system.version", "系统版本");
        names.put("system.description", "系统描述");
        names.put("system.max.file.size", "最大文件大小");
        names.put("system.session.timeout", "会话超时时间");
        names.put("system.enable.registration", "启用用户注册");
        names.put("system.enable.email.notification", "启用邮件通知");
        names.put("fee.default.rate", "默认党费比例");
        names.put("fee.min.amount", "最低党费金额");
        names.put("fee.max.amount", "最高党费金额");
        names.put("fee.payment.deadline.day", "缴费截止日期");
        names.put("fee.overdue.reminder.days", "逾期提醒天数");
        names.put("security.password.min.length", "密码最小长度");
        names.put("security.password.max.attempts", "密码最大尝试次数");
        names.put("security.session.max.concurrent", "最大并发会话数");
        names.put("email.smtp.host", "SMTP服务器地址");
        names.put("email.smtp.port", "SMTP服务器端口");
        names.put("email.smtp.username", "SMTP用户名");
        names.put("email.smtp.password", "SMTP密码");
        names.put("email.from.address", "发件人邮箱");
        names.put("email.from.name", "发件人名称");
        
        return names.getOrDefault(key, key);
    }
    
    /**
     * 获取默认配置描述
     */
    private String getDefaultConfigDescription(String key) {
        Map<String, String> descriptions = new HashMap<>();
        descriptions.put("system.name", "系统显示名称");
        descriptions.put("system.version", "当前系统版本号");
        descriptions.put("system.description", "系统功能描述");
        descriptions.put("system.max.file.size", "允许上传的最大文件大小（字节）");
        descriptions.put("system.session.timeout", "用户会话超时时间（秒）");
        descriptions.put("system.enable.registration", "是否允许用户自主注册");
        descriptions.put("system.enable.email.notification", "是否启用邮件通知功能");
        descriptions.put("fee.default.rate", "默认党费缴纳比例");
        descriptions.put("fee.min.amount", "最低党费缴纳金额");
        descriptions.put("fee.max.amount", "最高党费缴纳金额");
        descriptions.put("fee.payment.deadline.day", "每月党费缴纳截止日期");
        descriptions.put("fee.overdue.reminder.days", "党费逾期提醒提前天数");
        descriptions.put("security.password.min.length", "用户密码最小长度要求");
        descriptions.put("security.password.max.attempts", "密码错误最大尝试次数");
        descriptions.put("security.session.max.concurrent", "单用户最大并发登录会话数");
        descriptions.put("email.smtp.host", "邮件服务器SMTP地址");
        descriptions.put("email.smtp.port", "邮件服务器SMTP端口");
        descriptions.put("email.smtp.username", "邮件服务器登录用户名");
        descriptions.put("email.smtp.password", "邮件服务器登录密码");
        descriptions.put("email.from.address", "系统发送邮件的发件人地址");
        descriptions.put("email.from.name", "系统发送邮件的发件人名称");
        
        return descriptions.getOrDefault(key, "系统配置项");
    }
    
    /**
     * 获取默认配置类型
     */
    private SystemConfig.ValueType getDefaultConfigType(String key) {
        if (key.contains("enable") || key.contains("boolean")) {
            return SystemConfig.ValueType.BOOLEAN;
        }
        if (key.contains("size") || key.contains("timeout") || key.contains("length") || 
            key.contains("attempts") || key.contains("concurrent") || key.contains("port") ||
            key.contains("day") || key.contains("days")) {
            return SystemConfig.ValueType.INTEGER;
        }
        if (key.contains("rate") || key.contains("amount")) {
            return SystemConfig.ValueType.STRING;
        }
        return SystemConfig.ValueType.STRING;
    }
    
    /**
     * 判断默认配置是否需要加密
     */
    private boolean isDefaultConfigEncrypted(String key) {
        return key.contains("password") || key.contains("secret") || key.contains("key");
    }
}