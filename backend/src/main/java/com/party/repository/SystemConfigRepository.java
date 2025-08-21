package com.party.repository;

import com.party.entity.SystemConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 系统配置Repository接口
 */
@Repository
public interface SystemConfigRepository extends JpaRepository<SystemConfig, Long> {
    
    /**
     * 根据配置键查询配置
     * @param configKey 配置键
     * @return 系统配置
     */
    Optional<SystemConfig> findByConfigKey(String configKey);
    
    /**
     * 根据配置键列表查询配置
     * @param configKeys 配置键列表
     * @return 系统配置列表
     */
    List<SystemConfig> findByConfigKeyIn(List<String> configKeys);
    
    /**
     * 根据配置名称查询配置
     * @param configName 配置名称
     * @return 系统配置列表
     */
    List<SystemConfig> findByConfigNameContainingIgnoreCase(String configName);
    
    /**
     * 根据值类型查询配置
     * @param valueType 值类型
     * @return 系统配置列表
     */
    List<SystemConfig> findByValueType(SystemConfig.ValueType valueType);
    
    /**
     * 查询所有系统配置
     * @param isSystem 是否为系统配置
     * @return 系统配置列表
     */
    List<SystemConfig> findByIsSystem(Boolean isSystem);
    
    /**
     * 查询所有加密配置
     * @param isEncrypted 是否加密
     * @return 系统配置列表
     */
    List<SystemConfig> findByIsEncrypted(Boolean isEncrypted);
    
    /**
     * 根据配置键前缀查询配置
     * @param keyPrefix 配置键前缀
     * @return 系统配置列表
     */
    @Query("SELECT sc FROM SystemConfig sc WHERE sc.configKey LIKE CONCAT(:keyPrefix, '%') " +
           "ORDER BY sc.configKey")
    List<SystemConfig> findByConfigKeyStartingWith(@Param("keyPrefix") String keyPrefix);
    
    /**
     * 查询用户可见的配置（非系统配置且非加密配置）
     * @return 系统配置列表
     */
    @Query("SELECT sc FROM SystemConfig sc WHERE sc.isSystem = false " +
           "AND sc.isEncrypted = false ORDER BY sc.configKey")
    List<SystemConfig> findUserVisibleConfigs();
    
    /**
     * 查询系统核心配置
     * @return 系统配置列表
     */
    @Query("SELECT sc FROM SystemConfig sc WHERE sc.isSystem = true " +
           "ORDER BY sc.configKey")
    List<SystemConfig> findSystemConfigs();
    
    /**
     * 查询加密配置
     * @return 系统配置列表
     */
    @Query("SELECT sc FROM SystemConfig sc WHERE sc.isEncrypted = true " +
           "ORDER BY sc.configKey")
    List<SystemConfig> findEncryptedConfigs();
    
    /**
     * 检查配置键是否存在
     * @param configKey 配置键
     * @return 是否存在
     */
    boolean existsByConfigKey(String configKey);
    
    /**
     * 根据配置键删除配置
     * @param configKey 配置键
     */
    void deleteByConfigKey(String configKey);
    
    /**
     * 统计配置数量
     * @return 配置总数
     */
    @Query("SELECT COUNT(sc) FROM SystemConfig sc")
    long countAllConfigs();
    
    /**
     * 统计系统配置数量
     * @return 系统配置数量
     */
    @Query("SELECT COUNT(sc) FROM SystemConfig sc WHERE sc.isSystem = true")
    long countSystemConfigs();
    
    /**
     * 统计用户配置数量
     * @return 用户配置数量
     */
    @Query("SELECT COUNT(sc) FROM SystemConfig sc WHERE sc.isSystem = false")
    long countUserConfigs();
    
    /**
     * 根据值类型统计配置数量
     * @return 统计结果
     */
    @Query("SELECT sc.valueType, COUNT(sc) FROM SystemConfig sc " +
           "GROUP BY sc.valueType ORDER BY sc.valueType")
    List<Object[]> countConfigsByValueType();
    
    /**
     * 查询最近更新的配置
     * @param limit 限制数量
     * @return 系统配置列表
     */
    @Query("SELECT sc FROM SystemConfig sc ORDER BY sc.updatedAt DESC")
    List<SystemConfig> findRecentlyUpdatedConfigs();
    
    /**
     * 查询配置键包含指定关键字的配置
     * @param keyword 关键字
     * @return 系统配置列表
     */
    @Query("SELECT sc FROM SystemConfig sc WHERE sc.configKey LIKE %:keyword% " +
           "OR sc.configName LIKE %:keyword% OR sc.description LIKE %:keyword% " +
           "ORDER BY sc.configKey")
    List<SystemConfig> searchConfigs(@Param("keyword") String keyword);
    
    /**
     * 批量查询配置值
     * @param configKeys 配置键列表
     * @return 配置键值对
     */
    @Query("SELECT sc.configKey, sc.configValue FROM SystemConfig sc " +
           "WHERE sc.configKey IN :configKeys")
    List<Object[]> findConfigValues(@Param("configKeys") List<String> configKeys);
}