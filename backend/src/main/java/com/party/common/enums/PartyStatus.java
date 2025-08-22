package com.party.common.enums;

/**
 * 党员状态枚举
 * 
 * @author Party Management System
 * @version 1.0.0
 */
public enum PartyStatus {
    FULL_MEMBER(1, "正式党员"),
    PROBATIONARY_MEMBER(2, "预备党员"),
    ACTIVE_MEMBER(3, "入党积极分子"),
    RESIGNED(4, "已退党");

    private final Integer code;
    private final String description;

    PartyStatus(Integer code, String description) {
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
        for (PartyStatus status : values()) {
            if (status.getCode().equals(code)) {
                return status.getDescription();
            }
        }
        return "未知";
    }
}