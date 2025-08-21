package com.party.interceptor;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.party.entity.OperationLog;
import com.party.service.OperationLogService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.time.LocalDateTime;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

/**
 * 操作日志拦截器
 * 自动记录系统操作日志
 * 
 * @author Party Management System
 * @version 1.0.0
 */
@Component
public class OperationLogInterceptor implements HandlerInterceptor {

    private static final Logger logger = LoggerFactory.getLogger(OperationLogInterceptor.class);

    @Autowired
    private OperationLogService operationLogService;

    @Autowired
    private ObjectMapper objectMapper;

    private static final String START_TIME_ATTRIBUTE = "startTime";
    private static final String OPERATION_LOG_ATTRIBUTE = "operationLog";

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 记录请求开始时间
        request.setAttribute(START_TIME_ATTRIBUTE, System.currentTimeMillis());
        
        // 只记录API请求
        String requestURI = request.getRequestURI();
        if (!shouldLog(requestURI)) {
            return true;
        }
        
        try {
            // 创建操作日志对象
            OperationLog operationLog = new OperationLog();
            
            // 设置用户信息
            setUserInfo(operationLog);
            
            // 设置请求信息
            setRequestInfo(operationLog, request);
            
            // 设置客户端信息
            setClientInfo(operationLog, request);
            
            // 设置操作信息
            setOperationInfo(operationLog, request);
            
            // 将日志对象存储到请求属性中，供后续处理使用
            request.setAttribute(OPERATION_LOG_ATTRIBUTE, operationLog);
            
        } catch (Exception e) {
            logger.error("记录操作日志失败: {}", e.getMessage(), e);
        }
        
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        // 在视图渲染之前处理
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        // 只记录API请求
        String requestURI = request.getRequestURI();
        if (!shouldLog(requestURI)) {
            return;
        }
        
        try {
            OperationLog operationLog = (OperationLog) request.getAttribute(OPERATION_LOG_ATTRIBUTE);
            if (operationLog == null) {
                return;
            }
            
            // 计算执行时间
            Long startTime = (Long) request.getAttribute(START_TIME_ATTRIBUTE);
            if (startTime != null) {
                operationLog.setExecutionTime(System.currentTimeMillis() - startTime);
            }
            
            // 设置响应信息
            setResponseInfo(operationLog, response, ex);
            
            // 设置创建时间
            operationLog.setCreatedAt(LocalDateTime.now());
            
            // 异步保存日志
            saveLogAsync(operationLog);
            
        } catch (Exception e) {
            logger.error("完成操作日志记录失败: {}", e.getMessage(), e);
        }
    }

    /**
     * 判断是否需要记录日志
     */
    private boolean shouldLog(String requestURI) {
        // 排除不需要记录的请求
        if (requestURI.contains("/swagger") || 
            requestURI.contains("/v3/api-docs") ||
            requestURI.contains("/favicon.ico") ||
            requestURI.contains("/static/") ||
            requestURI.contains("/css/") ||
            requestURI.contains("/js/") ||
            requestURI.contains("/images/") ||
            requestURI.contains("/actuator/")) {
            return false;
        }
        
        // 只记录API请求
        return requestURI.startsWith("/api/");
    }

    /**
     * 设置用户信息
     */
    private void setUserInfo(OperationLog operationLog) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated() && 
                !"anonymousUser".equals(authentication.getPrincipal())) {
                
                Object principal = authentication.getPrincipal();
                if (principal instanceof UserDetails) {
                    UserDetails userDetails = (UserDetails) principal;
                    operationLog.setUsername(userDetails.getUsername());
                    // 如果UserDetails实现类包含用户ID，可以在这里设置
                    // operationLog.setUserId(((CustomUserDetails) userDetails).getUserId());
                } else {
                    operationLog.setUsername(principal.toString());
                }
            } else {
                operationLog.setUsername("anonymous");
            }
        } catch (Exception e) {
            logger.warn("获取用户信息失败: {}", e.getMessage());
            operationLog.setUsername("unknown");
        }
    }

    /**
     * 设置请求信息
     */
    private void setRequestInfo(OperationLog operationLog, HttpServletRequest request) {
        operationLog.setRequestMethod(request.getMethod());
        operationLog.setRequestUrl(request.getRequestURI());
        
        // 获取请求参数
        Map<String, String[]> parameterMap = request.getParameterMap();
        if (!parameterMap.isEmpty()) {
            try {
                Map<String, Object> params = new HashMap<>();
                for (Map.Entry<String, String[]> entry : parameterMap.entrySet()) {
                    String[] values = entry.getValue();
                    if (values.length == 1) {
                        params.put(entry.getKey(), values[0]);
                    } else {
                        params.put(entry.getKey(), values);
                    }
                }
                operationLog.setRequestParams(objectMapper.writeValueAsString(params));
            } catch (Exception e) {
                logger.warn("序列化请求参数失败: {}", e.getMessage());
                operationLog.setRequestParams(parameterMap.toString());
            }
        }
    }

    /**
     * 设置客户端信息
     */
    private void setClientInfo(OperationLog operationLog, HttpServletRequest request) {
        // 获取IP地址
        String ipAddress = getClientIpAddress(request);
        operationLog.setIpAddress(ipAddress);
        
        // 获取User-Agent
        String userAgent = request.getHeader("User-Agent");
        operationLog.setUserAgent(userAgent);
    }

    /**
     * 设置操作信息
     */
    private void setOperationInfo(OperationLog operationLog, HttpServletRequest request) {
        String requestURI = request.getRequestURI();
        String method = request.getMethod();
        
        // 根据请求路径和方法推断操作类型和模块
        String[] pathParts = requestURI.split("/");
        if (pathParts.length >= 3) {
            String module = pathParts[2]; // /api/users -> users
            operationLog.setOperationModule(getModuleName(module));
        }
        
        operationLog.setOperationType(getOperationType(method));
        operationLog.setOperationDescription(generateOperationDescription(requestURI, method));
    }

    /**
     * 设置响应信息
     */
    private void setResponseInfo(OperationLog operationLog, HttpServletResponse response, Exception ex) {
        operationLog.setResponseStatus(response.getStatus());
        
        if (ex != null) {
            operationLog.setSuccess(false);
            operationLog.setErrorMessage(ex.getMessage());
            operationLog.setResponseMessage("操作失败: " + ex.getMessage());
        } else {
            operationLog.setSuccess(response.getStatus() < 400);
            if (response.getStatus() >= 400) {
                operationLog.setResponseMessage("HTTP错误: " + response.getStatus());
            } else {
                operationLog.setResponseMessage("操作成功");
            }
        }
    }

    /**
     * 获取客户端IP地址
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String[] headerNames = {
            "X-Forwarded-For",
            "X-Real-IP",
            "Proxy-Client-IP",
            "WL-Proxy-Client-IP",
            "HTTP_CLIENT_IP",
            "HTTP_X_FORWARDED_FOR"
        };
        
        for (String headerName : headerNames) {
            String ip = request.getHeader(headerName);
            if (ip != null && !ip.isEmpty() && !"unknown".equalsIgnoreCase(ip)) {
                // 多个IP时取第一个
                if (ip.contains(",")) {
                    ip = ip.split(",")[0].trim();
                }
                return ip;
            }
        }
        
        return request.getRemoteAddr();
    }

    /**
     * 获取模块名称
     */
    private String getModuleName(String module) {
        switch (module.toLowerCase()) {
            case "users": return "用户管理";
            case "roles": return "角色管理";
            case "permissions": return "权限管理";
            case "organizations": return "组织管理";
            case "activities": return "活动管理";
            case "fees": return "党费管理";
            case "operation-logs": return "日志管理";
            case "system": return "系统管理";
            case "statistics": return "统计分析";
            default: return "未知模块";
        }
    }

    /**
     * 获取操作类型
     */
    private String getOperationType(String method) {
        switch (method.toUpperCase()) {
            case "GET": return "QUERY";
            case "POST": return "CREATE";
            case "PUT": return "UPDATE";
            case "DELETE": return "DELETE";
            case "PATCH": return "UPDATE";
            default: return "OTHER";
        }
    }

    /**
     * 生成操作描述
     */
    private String generateOperationDescription(String requestURI, String method) {
        String[] pathParts = requestURI.split("/");
        if (pathParts.length >= 3) {
            String module = pathParts[2];
            String moduleName = getModuleName(module);
            
            switch (method.toUpperCase()) {
                case "GET":
                    if (requestURI.contains("/search")) {
                        return "搜索" + moduleName;
                    } else if (requestURI.matches(".*/\\d+$")) {
                        return "查看" + moduleName + "详情";
                    } else {
                        return "查询" + moduleName + "列表";
                    }
                case "POST":
                    return "创建" + moduleName;
                case "PUT":
                    return "更新" + moduleName;
                case "DELETE":
                    return "删除" + moduleName;
                default:
                    return "操作" + moduleName;
            }
        }
        return "系统操作";
    }

    /**
     * 异步保存日志
     */
    private void saveLogAsync(OperationLog operationLog) {
        try {
            // 这里可以使用异步方式保存日志，避免影响主业务流程
            operationLogService.save(operationLog);
        } catch (Exception e) {
            logger.error("保存操作日志失败: {}", e.getMessage(), e);
        }
    }
}