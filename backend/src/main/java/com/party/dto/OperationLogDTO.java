package com.party.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

/**
 * 操作日志数据传输对象
 * 
 * @author Party Management System
 * @version 1.0.0
 */
@Schema(description = "操作日志数据传输对象")
public class OperationLogDTO {

    @Schema(description = "日志ID", example = "1")
    private Long id;

    @Schema(description = "用户ID", example = "1")
    private Long userId;

    @Schema(description = "用户名", example = "admin")
    private String username;

    @Schema(description = "操作类型", example = "CREATE")
    private String operationType;

    @Schema(description = "操作模块", example = "用户管理")
    private String operationModule;

    @Schema(description = "操作描述", example = "创建用户")
    private String operationDescription;

    @Schema(description = "目标类型", example = "User")
    private String targetType;

    @Schema(description = "目标ID", example = "123")
    private String targetId;

    @Schema(description = "目标名称", example = "张三")
    private String targetName;

    @Schema(description = "请求方法", example = "POST")
    private String requestMethod;

    @Schema(description = "请求URL", example = "/api/users")
    private String requestUrl;

    @Schema(description = "请求参数")
    private String requestParams;

    @Schema(description = "响应状态码", example = "200")
    private Integer responseStatus;

    @Schema(description = "响应消息", example = "操作成功")
    private String responseMessage;

    @Schema(description = "IP地址", example = "192.168.1.100")
    private String ipAddress;

    @Schema(description = "用户代理")
    private String userAgent;

    @Schema(description = "执行时间（毫秒）", example = "150")
    private Long executionTime;

    @Schema(description = "是否成功", example = "true")
    private Boolean success;

    @Schema(description = "错误消息")
    private String errorMessage;

    @Schema(description = "创建时间", example = "2024-01-01 12:00:00")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    // 扩展字段
    @Schema(description = "操作结果", example = "成功")
    private String operationResult;

    @Schema(description = "风险等级", example = "LOW")
    private String riskLevel;

    @Schema(description = "操作来源", example = "WEB")
    private String operationSource;

    // 构造函数
    public OperationLogDTO() {}

    public OperationLogDTO(Long id, Long userId, String username, String operationType, 
                          String operationModule, String operationDescription, 
                          String targetType, String targetId, String targetName,
                          String requestMethod, String requestUrl, String requestParams,
                          Integer responseStatus, String responseMessage, String ipAddress,
                          String userAgent, Long executionTime, Boolean success,
                          String errorMessage, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.username = username;
        this.operationType = operationType;
        this.operationModule = operationModule;
        this.operationDescription = operationDescription;
        this.targetType = targetType;
        this.targetId = targetId;
        this.targetName = targetName;
        this.requestMethod = requestMethod;
        this.requestUrl = requestUrl;
        this.requestParams = requestParams;
        this.responseStatus = responseStatus;
        this.responseMessage = responseMessage;
        this.ipAddress = ipAddress;
        this.userAgent = userAgent;
        this.executionTime = executionTime;
        this.success = success;
        this.errorMessage = errorMessage;
        this.createdAt = createdAt;
    }

    // Getter和Setter方法
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getOperationType() {
        return operationType;
    }

    public void setOperationType(String operationType) {
        this.operationType = operationType;
    }

    public String getOperationModule() {
        return operationModule;
    }

    public void setOperationModule(String operationModule) {
        this.operationModule = operationModule;
    }

    public String getOperationDescription() {
        return operationDescription;
    }

    public void setOperationDescription(String operationDescription) {
        this.operationDescription = operationDescription;
    }

    public String getTargetType() {
        return targetType;
    }

    public void setTargetType(String targetType) {
        this.targetType = targetType;
    }

    public String getTargetId() {
        return targetId;
    }

    public void setTargetId(String targetId) {
        this.targetId = targetId;
    }

    public String getTargetName() {
        return targetName;
    }

    public void setTargetName(String targetName) {
        this.targetName = targetName;
    }

    public String getRequestMethod() {
        return requestMethod;
    }

    public void setRequestMethod(String requestMethod) {
        this.requestMethod = requestMethod;
    }

    public String getRequestUrl() {
        return requestUrl;
    }

    public void setRequestUrl(String requestUrl) {
        this.requestUrl = requestUrl;
    }

    public String getRequestParams() {
        return requestParams;
    }

    public void setRequestParams(String requestParams) {
        this.requestParams = requestParams;
    }

    public Integer getResponseStatus() {
        return responseStatus;
    }

    public void setResponseStatus(Integer responseStatus) {
        this.responseStatus = responseStatus;
    }

    public String getResponseMessage() {
        return responseMessage;
    }

    public void setResponseMessage(String responseMessage) {
        this.responseMessage = responseMessage;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }

    public Long getExecutionTime() {
        return executionTime;
    }

    public void setExecutionTime(Long executionTime) {
        this.executionTime = executionTime;
    }

    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getOperationResult() {
        return operationResult;
    }

    public void setOperationResult(String operationResult) {
        this.operationResult = operationResult;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public String getOperationSource() {
        return operationSource;
    }

    public void setOperationSource(String operationSource) {
        this.operationSource = operationSource;
    }

    // 业务方法
    public String getOperationResultText() {
        return success != null && success ? "成功" : "失败";
    }

    public String getRiskLevelText() {
        if (riskLevel == null) return "未知";
        switch (riskLevel.toUpperCase()) {
            case "LOW": return "低";
            case "MEDIUM": return "中";
            case "HIGH": return "高";
            case "CRITICAL": return "严重";
            default: return "未知";
        }
    }

    public String getOperationSourceText() {
        if (operationSource == null) return "未知";
        switch (operationSource.toUpperCase()) {
            case "WEB": return "网页";
            case "MOBILE": return "移动端";
            case "API": return "API";
            case "SYSTEM": return "系统";
            default: return "未知";
        }
    }

    @Override
    public String toString() {
        return "OperationLogDTO{" +
                "id=" + id +
                ", userId=" + userId +
                ", username='" + username + '\'' +
                ", operationType='" + operationType + '\'' +
                ", operationModule='" + operationModule + '\'' +
                ", operationDescription='" + operationDescription + '\'' +
                ", targetType='" + targetType + '\'' +
                ", targetId='" + targetId + '\'' +
                ", targetName='" + targetName + '\'' +
                ", success=" + success +
                ", createdAt=" + createdAt +
                '}';
    }
}