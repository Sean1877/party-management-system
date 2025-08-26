package com.party.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 统计分析服务接口
 * 
 * @author Party Management System
 * @version 1.0.0
 */
public interface StatisticsService {

    /**
     * 获取用户统计数据
     * 
     * @return 用户统计数据
     */
    Map<String, Object> getUserStatistics();

    /**
     * 获取组织统计数据
     * 
     * @return 组织统计数据
     */
    Map<String, Object> getOrganizationStatistics();

    /**
     * 获取活动统计数据
     * 
     * @return 活动统计数据
     */
    Map<String, Object> getActivityStatistics();

    /**
     * 获取系统总体统计数据
     * 
     * @return 系统统计数据
     */
    Map<String, Object> getSystemStatistics();

    /**
     * 获取用户增长趋势数据
     * 
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 用户增长趋势数据
     */
    List<Map<String, Object>> getUserGrowthTrend(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * 获取活动参与率统计
     * 
     * @param organizationId 组织ID（可选）
     * @return 活动参与率统计
     */
    Map<String, Object> getActivityParticipationRate(Long organizationId);

    /**
     * 获取党员状态分布统计
     * 
     * @return 党员状态分布统计
     */
    Map<String, Object> getPartyMemberStatusDistribution();

    /**
     * 获取组织层级分布统计
     * 
     * @return 组织层级分布统计
     */
    Map<String, Object> getOrganizationLevelDistribution();

    /**
     * 获取活动类型分布统计
     * 
     * @param startDate 开始日期（可选）
     * @param endDate 结束日期（可选）
     * @return 活动类型分布统计
     */
    Map<String, Object> getActivityTypeDistribution(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * 获取月度统计报表
     * 
     * @param year 年份
     * @param month 月份
     * @return 月度统计报表
     */
    Map<String, Object> getMonthlyReport(Integer year, Integer month);

    /**
     * 获取年度统计报表
     * 
     * @param year 年份
     * @return 年度统计报表
     */
    Map<String, Object> getYearlyReport(Integer year);

    /**
     * 获取组织活跃度排名
     * 
     * @param limit 限制数量
     * @return 组织活跃度排名
     */
    List<Map<String, Object>> getOrganizationActivityRanking(int limit);

    /**
     * 获取用户活跃度排名
     * 
     * @param limit 限制数量
     * @return 用户活跃度排名
     */
    List<Map<String, Object>> getUserActivityRanking(int limit);

    /**
     * 获取生日提醒统计
     * 
     * @param daysAhead 提前天数
     * @return 生日提醒统计
     */
    Map<String, Object> getBirthdayReminderStatistics(int daysAhead);

    /**
     * 获取党龄提醒统计
     * 
     * @param daysAhead 提前天数
     * @return 党龄提醒统计
     */
    Map<String, Object> getPartyAnniversaryReminderStatistics(int daysAhead);

    /**
     * 获取数据导出统计
     * 
     * @param exportType 导出类型
     * @param filters 过滤条件
     * @return 导出数据统计
     */
    Map<String, Object> getExportStatistics(String exportType, Map<String, Object> filters);

    // 新增方法供StatisticsController使用
    Map<String, Object> getSystemOverview();
    List<Map<String, Object>> getUserGrowthTrend(int period);
    List<Map<String, Object>> getUserAgeDistribution();
    List<Map<String, Object>> getUserGenderDistribution();
    List<Map<String, Object>> getOrganizationDistribution();
    List<Map<String, Object>> getOrganizationMemberGrowth(int period);
    Map<String, Object> getActivityOverview();
    List<Map<String, Object>> getActivityTypeDistribution();
    List<Map<String, Object>> getActivityParticipationTrend(int period);
    Map<String, Object> getFeeOverview();
    List<Map<String, Object>> getFeePaymentTrend(int period, String type);
    List<Map<String, Object>> getFeePaymentMethods();
    Map<String, Object> getFeeOverdue();
}