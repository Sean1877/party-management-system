package com.party.entity;

import io.swagger.v3.oas.annotations.media.Schema;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * 操作日志实体类
 * 
 * @author Party Management System
 * @version 1.0.0
 */
@Entity
@Table(name = "operation_logs")
@Schema(description = "操作日志实体")
public class OperationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "日志ID")
    private Long id;

    @Column(name = "user_id")
    @Schema(description = "操作用户ID")
    private Long userId;

    @Column(name = "username", length = 50)
    @Schema(description = "操作用户名")
    private String username;

    @Column(name = "operation_type", length = 50, nullable = false)
    @Schema(description = "操作类型", example = "CREATE")
    private String operationType;

    @Column(name = "operation_module", length = 50)
    @Schema(description = "操作模块", example = "用户管理")
    private String operationModule;

    @Column(name = "operation_description", length = 500)
    @Schema(description = "操作描述", example = "创建用户")
    private String operationDescription;

    @Column(name = "target_type", length = 50)
    @Schema(description = "目标类型", example = "User")
    private String targetType;

    @Column(name = "target_id")
    @Schema(description = "目标ID")
    private Long targetId;

    @Column(name = "target_name", length = 100)
    @Schema(description = "目标名称")
    private String targetName;

    @Column(name = "request_method", length = 10)
    @Schema(description = "请求方法", example = "POST")
    private String requestMethod;

    @Column(name = "request_url", length = 500)
    @Schema(description = "请求URL")
    private String requestUrl;

    @Column(name = "request_params", columnDefinition = "TEXT")
    @Schema(description = "请求参数")
    private String requestParams;

    @Column(name = "response_status")
    @Schema(description = "响应状态码")
    private Integer responseStatus;

    @Column(name = "response_message", length = 1000)
    @Schema(description = "响应消息")
    private String responseMessage;

    @Column(name = "ip_address", length = 50)
    @Schema(description = "IP地址")
    private String ipAddress;

    @Column(name = "user_agent", length = 500)
    @Schema(description = "用户代理")
    private String userAgent;

    @Column(name = "execution_time")
    @Schema(description = "执行时间(毫秒)")
    private Long executionTime;

    @Column(name = "success", nullable = false)
    @Schema(description = "是否成功")
    private Boolean success;

    @Column(name = "error_message", length = 1000)
    @Schema(description = "错误信息")
    private String errorMessage;

    @Column(name = "created_at", nullable = false)
    @Schema(description = "创建时间")
    private LocalDateTime createdAt;

    // ==================== 构造方法 ====================

    public OperationLog() {
        this.createdAt = LocalDateTime.now();
        this.success = true;
    }

    public OperationLog(String operationType, String operationModule, String operationDescription) {
        this();
        this.operationType = operationType;
        this.operationModule = operationModule;
        this.operationDescription = operationDescription;
    }

    // ==================== JPA 生命周期回调 ====================

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (success == null) {
            success = true;
        }
    }

    // ==================== 业务方法 ====================

    /**
     * 标记操作失败
     */
    public void markAsFailed(String errorMessage) {
        this.success = false;
        this.errorMessage = errorMessage;
    }

    /**
     * 设置目标信息
     */
    public void setTarget(String targetType, Long targetId, String targetName) {
        this.targetType = targetType;
        this.targetId = targetId;
        this.targetName = targetName;
    }

    /**
     * 设置请求信息
     */
    public void setRequestInfo(String method, String url, String params) {
        this.requestMethod = method;
        this.requestUrl = url;
        this.requestParams = params;
    }

    /**
     * 设置响应信息
     */
    public void setResponseInfo(Integer status, String message) {
        this.responseStatus = status;
        this.responseMessage = message;
    }

    /**
     * 设置用户信息
     */
    public void setUserInfo(Long userId, String username) {
        this.userId = userId;
        this.username = username;
    }

    /**
     * 设置客户端信息
     */
    public void setClientInfo(String ipAddress, String userAgent) {
        this.ipAddress = ipAddress;
        this.userAgent = userAgent;
    }

    // ==================== Getter 和 Setter ====================

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

    public Long getTargetId() {
        return targetId;
    }

    public void setTargetId(Long targetId) {
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

    // ==================== toString ====================

    @Override
    public String toString() {
        return "OperationLog{" +
                "id=" + id +
                ", userId=" + userId +
                ", username='" + username + '\'' +
                ", operationType='" + operationType + '\'' +
                ", operationModule='" + operationModule + '\'' +
                ", operationDescription='" + operationDescription + '\'' +
                ", targetType='" + targetType + '\'' +
                ", targetId=" + targetId +
                ", success=" + success +
                ", createdAt=" + createdAt +
                '}';
    }
}