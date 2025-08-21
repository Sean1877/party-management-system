package com.party.service;

import com.party.entity.SystemConfig;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

/**
 * 系统配置服务接口
 */
public interface SystemConfigService {
    
    // ==================== 基础CRUD操作 ====================
    
    /**
     * 创建系统配置
     * @param systemConfig 系统配置
     * @return 创建的系统配置
     */
    SystemConfig createConfig(SystemConfig systemConfig);
    
    /**
     * 更新系统配置
     * @param id 配置ID
     * @param systemConfig 系统配置
     * @return 更新的系统配置
     */
    SystemConfig updateConfig(Long id, SystemConfig systemConfig);
    
    /**
     * 删除系统配置
     * @param id 配置ID
     */
    void deleteConfig(Long id);
    
    /**
     * 根据ID查询系统配置
     * @param id 配置ID
     * @return 系统配置
     */
    SystemConfig getConfigById(Long id);
    
    /**
     * 分页查询系统配置
     * @param pageable 分页参数
     * @return 系统配置分页
     */
    Page<SystemConfig> getConfigs(Pageable pageable);
    
    // ==================== 配置查询操作 ====================
    
    /**
     * 根据配置键查询配置
     * @param configKey 配置键
     * @return 系统配置
     */
    SystemConfig getConfigByKey(String configKey);
    
    /**
     * 根据配置键获取配置值
     * @param configKey 配置键
     * @return 配置值
     */
    String getConfigValue(String configKey);
    
    /**
     * 根据配置键获取配置值，如果不存在则返回默认值
     * @param configKey 配置键
     * @param defaultValue 默认值
     * @return 配置值
     */
    String getConfigValue(String configKey, String defaultValue);
    
    /**
     * 根据配置键列表批量获取配置
     * @param configKeys 配置键列表
     * @return 配置映射
     */
    Map<String, String> getConfigValues(List<String> configKeys);
    
    /**
     * 根据配置键前缀查询配置
     * @param keyPrefix 配置键前缀
     * @return 配置列表
     */
    List<SystemConfig> getConfigsByKeyPrefix(String keyPrefix);
    
    /**
     * 查询用户可见的配置
     * @return 配置列表
     */
    List<SystemConfig> getUserVisibleConfigs();
    
    /**
     * 查询系统核心配置
     * @return 配置列表
     */
    List<SystemConfig> getSystemConfigs();
    
    /**
     * 根据值类型查询配置
     * @param valueType 值类型
     * @return 配置列表
     */
    List<SystemConfig> getConfigsByValueType(SystemConfig.ValueType valueType);
    
    // ==================== 配置设置操作 ====================
    
    /**
     * 设置配置值
     * @param configKey 配置键
     * @param configValue 配置值
     * @return 系统配置
     */
    SystemConfig setConfigValue(String configKey, String configValue);
    
    /**
     * 批量设置配置值
     * @param configMap 配置映射
     * @return 设置结果
     */
    Map<String, Boolean> setConfigValues(Map<String, String> configMap);
    
    /**
     * 设置配置值（带描述）
     * @param configKey 配置键
     * @param configValue 配置值
     * @param configName 配置名称
     * @param description 配置描述
     * @return 系统配置
     */
    SystemConfig setConfigValue(String configKey, String configValue, String configName, String description);
    
    /**
     * 删除配置
     * @param configKey 配置键
     */
    void deleteConfigByKey(String configKey);
    
    // ==================== 类型转换操作 ====================
    
    /**
     * 获取字符串类型配置值
     * @param configKey 配置键
     * @param defaultValue 默认值
     * @return 字符串值
     */
    String getStringValue(String configKey, String defaultValue);
    
    /**
     * 获取整数类型配置值
     * @param configKey 配置键
     * @param defaultValue 默认值
     * @return 整数值
     */
    Integer getIntValue(String configKey, Integer defaultValue);
    
    /**
     * 获取长整数类型配置值
     * @param configKey 配置键
     * @param defaultValue 默认值
     * @return 长整数值
     */
    Long getLongValue(String configKey, Long defaultValue);
    
    /**
     * 获取浮点数类型配置值
     * @param configKey 配置键
     * @param defaultValue 默认值
     * @return 浮点数值
     */
    Double getDoubleValue(String configKey, Double defaultValue);
    
    /**
     * 获取布尔类型配置值
     * @param configKey 配置键
     * @param defaultValue 默认值
     * @return 布尔值
     */
    Boolean getBooleanValue(String configKey, Boolean defaultValue);
    
    /**
     * 获取JSON类型配置值
     * @param configKey 配置键
     * @param clazz 目标类型
     * @param <T> 泛型类型
     * @return 对象值
     */
    <T> T getJsonValue(String configKey, Class<T> clazz);
    
    // ==================== 配置验证操作 ====================
    
    /**
     * 验证配置值格式
     * @param configKey 配置键
     * @param configValue 配置值
     * @param valueType 值类型
     * @return 验证结果
     */
    boolean validateConfigValue(String configKey, String configValue, SystemConfig.ValueType valueType);
    
    /**
     * 检查配置键是否存在
     * @param configKey 配置键
     * @return 是否存在
     */
    boolean existsByConfigKey(String configKey);
    
    /**
     * 检查配置是否为系统配置
     * @param configKey 配置键
     * @return 是否为系统配置
     */
    boolean isSystemConfig(String configKey);
    
    /**
     * 检查配置是否为加密配置
     * @param configKey 配置键
     * @return 是否为加密配置
     */
    boolean isEncryptedConfig(String configKey);
    
    // ==================== 配置搜索操作 ====================
    
    /**
     * 搜索配置
     * @param keyword 关键字
     * @param pageable 分页参数
     * @return 配置分页
     */
    Page<SystemConfig> searchConfigs(String keyword, Pageable pageable);
    
    /**
     * 根据配置名称搜索
     * @param configName 配置名称
     * @return 配置列表
     */
    List<SystemConfig> searchByConfigName(String configName);
    
    // ==================== 配置统计操作 ====================
    
    /**
     * 统计配置总数
     * @return 配置总数
     */
    long countAllConfigs();
    
    /**
     * 统计系统配置数量
     * @return 系统配置数量
     */
    long countSystemConfigs();
    
    /**
     * 统计用户配置数量
     * @return 用户配置数量
     */
    long countUserConfigs();
    
    /**
     * 根据值类型统计配置数量
     * @return 统计结果
     */
    Map<SystemConfig.ValueType, Long> countConfigsByValueType();
    
    /**
     * 查询最近更新的配置
     * @param limit 限制数量
     * @return 配置列表
     */
    List<SystemConfig> getRecentlyUpdatedConfigs(int limit);
    
    // ==================== 配置导入导出操作 ====================
    
    /**
     * 导出配置
     * @param includeSystemConfigs 是否包含系统配置
     * @param includeEncryptedConfigs 是否包含加密配置
     * @return 导出文件路径
     */
    String exportConfigs(boolean includeSystemConfigs, boolean includeEncryptedConfigs);
    
    /**
     * 导入配置
     * @param filePath 文件路径
     * @param overwriteExisting 是否覆盖已存在的配置
     * @return 导入结果
     */
    Map<String, Object> importConfigs(String filePath, boolean overwriteExisting);
    
    /**
     * 备份配置
     * @return 备份文件路径
     */
    String backupConfigs();
    
    /**
     * 恢复配置
     * @param backupFilePath 备份文件路径
     * @return 恢复结果
     */
    Map<String, Object> restoreConfigs(String backupFilePath);
    
    // ==================== 配置缓存操作 ====================
    
    /**
     * 刷新配置缓存
     */
    void refreshConfigCache();
    
    /**
     * 刷新指定配置的缓存
     * @param configKey 配置键
     */
    void refreshConfigCache(String configKey);
    
    /**
     * 清空配置缓存
     */
    void clearConfigCache();
    
    // ==================== 配置初始化操作 ====================
    
    /**
     * 初始化默认配置
     */
    void initializeDefaultConfigs();
    
    /**
     * 检查并创建必需的配置
     */
    void checkAndCreateRequiredConfigs();
    
    /**
     * 获取系统信息配置
     * @return 系统信息
     */
    Map<String, Object> getSystemInfo();
}