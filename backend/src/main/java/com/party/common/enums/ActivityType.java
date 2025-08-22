package com.party.common.enums;

/**
 * 活动类型枚举
 * 
 * @author Party Management System
 * @version 1.0.0
 */
public enum ActivityType {
    PARTY_MEETING(1, "党员大会"),
    BRANCH_MEETING(2, "支部委员会"),
    GROUP_MEETING(3, "党小组会"),
    PARTY_COURSE(4, "党课"),
    STUDY_SESSION(5, "学习研讨"),
    VOLUNTEER(6, "志愿服务"),
    OTHER(99, "其他");

    private final Integer code;
    private final String description;

    ActivityType(Integer code, String description) {
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
        for (ActivityType type : values()) {
            if (type.getCode().equals(code)) {
                return type.getDescription();
            }
        }
        return "未知";
    }
}