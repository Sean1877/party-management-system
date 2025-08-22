package com.party.common.enums;

/**
 * 活动状态枚举
 * 
 * @author Party Management System
 * @version 1.0.0
 */
public enum ActivityStatus {
    PLANNED(1, "计划中"),
    ONGOING(2, "进行中"),
    COMPLETED(3, "已完成"),
    CANCELLED(4, "已取消"),
    POSTPONED(5, "已延期");

    private final Integer code;
    private final String description;

    ActivityStatus(Integer code, String description) {
        this.code = code;
        this.description = description;
    }

    public Integer getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }

    public static String getDescriptionByCode(Integer code) {
        if (code == null) {
            return "未知";
        }
        for (ActivityStatus status : values()) {
            if (status.getCode().equals(code)) {
                return status.getDescription();
            }
        }
        return "未知";
    }
}