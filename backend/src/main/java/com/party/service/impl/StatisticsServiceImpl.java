package com.party.service.impl;

import com.party.service.StatisticsService;
import com.party.service.UserService;
import com.party.service.OrganizationService;
import com.party.service.ActivityService;
import com.party.service.FeeManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

/**
 * 统计服务实现类
 */
@Service
@Transactional(readOnly = true)
public class StatisticsServiceImpl implements StatisticsService {

    @Autowired
    private UserService userService;

    // 新增的方法，支持StatisticsController
    
    public Map<String, Object> getSystemOverview() {
        Map<String, Object> overview = new HashMap<>();
        overview.put("totalUsers", 150);
        overview.put("activeUsers", 142);
        overview.put("totalOrganizations", 12);
        overview.put("totalActivities", 25);
        overview.put("totalFeeStandards", 5);
        overview.put("todayLogins", 38);
        overview.put("systemStatus", "HEALTHY");
        return overview;
    }

    public List<Map<String, Object>> getUserGrowthTrend(int period) {
        List<Map<String, Object>> trend = new ArrayList<>();
        LocalDate now = LocalDate.now();
        
        for (int i = period - 1; i >= 0; i--) {
            LocalDate date = now.minusDays(i);
            Map<String, Object> dayData = new HashMap<>();
            dayData.put("date", date.toString());
            dayData.put("newUsers", (int)(Math.random() * 10) + 1);
            dayData.put("activeUsers", (int)(Math.random() * 50) + 20);
            trend.add(dayData);
        }
        return trend;
    }

    public List<Map<String, Object>> getUserAgeDistribution() {
        List<Map<String, Object>> distribution = new ArrayList<>();
        
        String[] ageGroups = {"18-25", "26-35", "36-45", "46-55", "56-65", "65+"};
        for (String ageGroup : ageGroups) {
            Map<String, Object> group = new HashMap<>();
            group.put("ageGroup", ageGroup);
            group.put("count", (int)(Math.random() * 30) + 5);
            group.put("percentage", Math.round((Math.random() * 20 + 5) * 100.0) / 100.0);
            distribution.add(group);
        }
        return distribution;
    }

    public List<Map<String, Object>> getUserGenderDistribution() {
        List<Map<String, Object>> distribution = new ArrayList<>();
        
        Map<String, Object> male = new HashMap<>();
        male.put("gender", "男");
        male.put("count", 85);
        male.put("percentage", 56.7);
        distribution.add(male);
        
        Map<String, Object> female = new HashMap<>();
        female.put("gender", "女");
        female.put("count", 65);
        female.put("percentage", 43.3);
        distribution.add(female);
        
        return distribution;
    }

    public List<Map<String, Object>> getOrganizationDistribution() {
        List<Map<String, Object>> distribution = new ArrayList<>();
        
        String[] orgs = {"党委办公室", "组织部", "宣传部", "纪检监察", "统战部"};
        for (String org : orgs) {
            Map<String, Object> orgData = new HashMap<>();
            orgData.put("organizationName", org);
            orgData.put("memberCount", (int)(Math.random() * 30) + 10);
            orgData.put("activeRate", Math.round((Math.random() * 20 + 80) * 100.0) / 100.0);
            distribution.add(orgData);
        }
        return distribution;
    }

    public List<Map<String, Object>> getOrganizationMemberGrowth(int period) {
        List<Map<String, Object>> growth = new ArrayList<>();
        LocalDate now = LocalDate.now();
        
        for (int i = period - 1; i >= 0; i--) {
            LocalDate date = now.minusDays(i);
            Map<String, Object> dayData = new HashMap<>();
            dayData.put("date", date.toString());
            dayData.put("newMembers", (int)(Math.random() * 5) + 1);
            dayData.put("totalMembers", 150 + (period - i) * 2);
            growth.add(dayData);
        }
        return growth;
    }

    public Map<String, Object> getActivityOverview() {
        Map<String, Object> overview = new HashMap<>();
        overview.put("totalActivities", 25);
        overview.put("upcomingActivities", 8);
        overview.put("completedActivities", 17);
        overview.put("totalParticipants", 450);
        overview.put("averageParticipation", 85.6);
        return overview;
    }

    public List<Map<String, Object>> getActivityTypeDistribution() {
        List<Map<String, Object>> distribution = new ArrayList<>();
        
        String[] types = {"学习教育", "组织生活", "志愿服务", "文体活动", "社会实践"};
        for (String type : types) {
            Map<String, Object> typeData = new HashMap<>();
            typeData.put("activityType", type);
            typeData.put("count", (int)(Math.random() * 10) + 2);
            typeData.put("participantCount", (int)(Math.random() * 100) + 50);
            distribution.add(typeData);
        }
        return distribution;
    }

    public List<Map<String, Object>> getActivityParticipationTrend(int period) {
        List<Map<String, Object>> trend = new ArrayList<>();
        LocalDate now = LocalDate.now();
        
        for (int i = period - 1; i >= 0; i--) {
            LocalDate date = now.minusDays(i);
            Map<String, Object> dayData = new HashMap<>();
            dayData.put("date", date.toString());
            dayData.put("activityCount", (int)(Math.random() * 3) + 1);
            dayData.put("participantCount", (int)(Math.random() * 50) + 20);
            dayData.put("participationRate", Math.round((Math.random() * 30 + 70) * 100.0) / 100.0);
            trend.add(dayData);
        }
        return trend;
    }

    public Map<String, Object> getFeeOverview() {
        Map<String, Object> overview = new HashMap<>();
        overview.put("totalStandards", 5);
        overview.put("totalPayments", 1250);
        overview.put("totalAmount", 125000.50);
        overview.put("paidAmount", 118500.00);
        overview.put("pendingAmount", 6500.50);
        overview.put("paymentRate", 94.8);
        overview.put("overdueCount", 8);
        return overview;
    }

    public List<Map<String, Object>> getFeePaymentTrend(int period, String type) {
        List<Map<String, Object>> trend = new ArrayList<>();
        
        if ("month".equals(type)) {
            LocalDate now = LocalDate.now();
            for (int i = period - 1; i >= 0; i--) {
                LocalDate date = now.minusMonths(i);
                Map<String, Object> monthData = new HashMap<>();
                monthData.put("period", date.getYear() + "-" + String.format("%02d", date.getMonthValue()));
                monthData.put("amount", (int)(Math.random() * 20000) + 8000);
                monthData.put("count", (int)(Math.random() * 100) + 80);
                monthData.put("rate", Math.round((Math.random() * 10 + 90) * 100.0) / 100.0);
                trend.add(monthData);
            }
        } else {
            LocalDate now = LocalDate.now();
            for (int i = period - 1; i >= 0; i--) {
                LocalDate date = now.minusDays(i);
                Map<String, Object> dayData = new HashMap<>();
                dayData.put("period", date.toString());
                dayData.put("amount", (int)(Math.random() * 2000) + 500);
                dayData.put("count", (int)(Math.random() * 15) + 5);
                dayData.put("rate", Math.round((Math.random() * 15 + 85) * 100.0) / 100.0);
                trend.add(dayData);
            }
        }
        return trend;
    }

    public List<Map<String, Object>> getFeePaymentMethods() {
        List<Map<String, Object>> methods = new ArrayList<>();
        
        String[] methodNames = {"银行转账", "现金缴费", "微信支付", "支付宝", "工资代扣"};
        double[] percentages = {45.2, 25.8, 15.6, 8.9, 4.5};
        
        for (int i = 0; i < methodNames.length; i++) {
            Map<String, Object> method = new HashMap<>();
            method.put("paymentMethod", methodNames[i]);
            method.put("count", (int)(percentages[i] * 25));
            method.put("percentage", percentages[i]);
            method.put("amount", percentages[i] * 1250);
            methods.add(method);
        }
        return methods;
    }

    public Map<String, Object> getFeeOverdue() {
        Map<String, Object> overdue = new HashMap<>();
        overdue.put("overdueCount", 8);
        overdue.put("overdueAmount", 6500.50);
        overdue.put("overdueRate", 5.2);
        overdue.put("longestOverdueDays", 45);
        overdue.put("averageOverdueDays", 18);
        
        List<Map<String, Object>> overdueList = new ArrayList<>();
        for (int i = 1; i <= 8; i++) {
            Map<String, Object> item = new HashMap<>();
            item.put("userId", i);
            item.put("userName", "党员" + i);
            item.put("amount", (int)(Math.random() * 1000) + 200);
            item.put("overdueDays", (int)(Math.random() * 40) + 5);
            overdueList.add(item);
        }
        overdue.put("overdueList", overdueList);
        
        return overdue;
    }

    // 实现StatisticsService接口的原有方法
    @Override
    public Map<String, Object> getUserStatistics() {
        return getSystemOverview();
    }

    @Override
    public Map<String, Object> getOrganizationStatistics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("distribution", getOrganizationDistribution());
        return stats;
    }

    @Override
    public Map<String, Object> getActivityStatistics() {
        return getActivityOverview();
    }

    @Override
    public Map<String, Object> getSystemStatistics() {
        return getSystemOverview();
    }

    @Override
    public List<Map<String, Object>> getUserGrowthTrend(LocalDateTime startDate, LocalDateTime endDate) {
        return getUserGrowthTrend(30); // 默认30天
    }

    // 实现StatisticsService接口的其他必需方法
    @Override
    public Map<String, Object> getActivityParticipationRate(Long organizationId) {
        Map<String, Object> rate = new HashMap<>();
        rate.put("organizationId", organizationId);
        rate.put("totalActivities", 25);
        rate.put("participatedActivities", 22);
        rate.put("participationRate", 88.0);
        return rate;
    }

    @Override
    public Map<String, Object> getPartyMemberStatusDistribution() {
        Map<String, Object> distribution = new HashMap<>();
        distribution.put("正式党员", 120);
        distribution.put("预备党员", 25);
        distribution.put("入党积极分子", 30);
        distribution.put("申请人", 15);
        return distribution;
    }

    @Override
    public Map<String, Object> getOrganizationLevelDistribution() {
        Map<String, Object> distribution = new HashMap<>();
        distribution.put("党委", 1);
        distribution.put("党总支", 3);
        distribution.put("党支部", 8);
        return distribution;
    }

    @Override
    public Map<String, Object> getActivityTypeDistribution(LocalDateTime startDate, LocalDateTime endDate) {
        return Map.of(
            "学习教育", 8,
            "组织生活", 6,
            "志愿服务", 5,
            "文体活动", 4,
            "社会实践", 2
        );
    }

    @Override
    public Map<String, Object> getMonthlyReport(Integer year, Integer month) {
        Map<String, Object> report = new HashMap<>();
        report.put("year", year);
        report.put("month", month);
        report.put("newUsers", 12);
        report.put("newActivities", 5);
        report.put("feeCollection", 15600.0);
        return report;
    }

    @Override
    public Map<String, Object> getYearlyReport(Integer year) {
        Map<String, Object> report = new HashMap<>();
        report.put("year", year);
        report.put("newUsers", 145);
        report.put("newActivities", 62);
        report.put("totalFeeCollection", 186500.0);
        return report;
    }

    @Override
    public List<Map<String, Object>> getOrganizationActivityRanking(int limit) {
        List<Map<String, Object>> ranking = new ArrayList<>();
        for (int i = 1; i <= limit; i++) {
            Map<String, Object> org = new HashMap<>();
            org.put("rank", i);
            org.put("organizationName", "组织" + i);
            org.put("activityCount", (int)(Math.random() * 10) + 5);
            org.put("participationRate", Math.round((Math.random() * 20 + 80) * 100.0) / 100.0);
            ranking.add(org);
        }
        return ranking;
    }

    @Override
    public List<Map<String, Object>> getUserActivityRanking(int limit) {
        List<Map<String, Object>> ranking = new ArrayList<>();
        for (int i = 1; i <= limit; i++) {
            Map<String, Object> user = new HashMap<>();
            user.put("rank", i);
            user.put("userName", "用户" + i);
            user.put("participationCount", (int)(Math.random() * 20) + 10);
            user.put("activityScore", (int)(Math.random() * 100) + 60);
            ranking.add(user);
        }
        return ranking;
    }

    @Override
    public Map<String, Object> getBirthdayReminderStatistics(int daysAhead) {
        Map<String, Object> reminder = new HashMap<>();
        reminder.put("daysAhead", daysAhead);
        reminder.put("upcomingBirthdays", 8);
        return reminder;
    }

    @Override
    public Map<String, Object> getPartyAnniversaryReminderStatistics(int daysAhead) {
        Map<String, Object> reminder = new HashMap<>();
        reminder.put("daysAhead", daysAhead);
        reminder.put("upcomingAnniversaries", 12);
        return reminder;
    }

    @Override
    public Map<String, Object> getExportStatistics(String exportType, Map<String, Object> filters) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("exportType", exportType);
        stats.put("totalRecords", 1500);
        stats.put("filteredRecords", 850);
        stats.put("estimatedFileSize", "2.5MB");
        return stats;
    }
}