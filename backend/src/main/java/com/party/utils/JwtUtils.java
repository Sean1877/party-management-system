package com.party.utils;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * JWT工具类
 * 
 * @author Party Management System
 * @version 1.0.0
 */
@Component
public class JwtUtils {

    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    @Value("${jwt.refresh-expiration}")
    private Long refreshExpiration;

    /**
     * 获取签名密钥
     */
    private SecretKey getSigningKey() {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * 从token中获取用户名
     */
    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    /**
     * 从token中获取过期时间
     */
    public Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }

    /**
     * 从token中获取指定声明
     */
    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    /**
     * 从token中获取所有声明
     */
    private Claims getAllClaimsFromToken(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            logger.error("解析JWT token失败: {}", e.getMessage());
            throw e;
        }
    }

    /**
     * 检查token是否过期
     */
    public Boolean isTokenExpired(String token) {
        try {
            final Date expiration = getExpirationDateFromToken(token);
            return expiration.before(new Date());
        } catch (Exception e) {
            return true;
        }
    }

    /**
     * 生成访问token
     */
    public String generateToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, username, expiration);
    }

    /**
     * 生成访问token（带额外声明）
     */
    public String generateToken(String username, Map<String, Object> extraClaims) {
        Map<String, Object> claims = new HashMap<>(extraClaims);
        return createToken(claims, username, expiration);
    }

    /**
     * 生成刷新token
     */
    public String generateRefreshToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("type", "refresh");
        return createToken(claims, username, refreshExpiration);
    }

    /**
     * 创建token
     */
    private String createToken(Map<String, Object> claims, String subject, Long expiration) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * 验证token
     */
    public Boolean validateToken(String token, String username) {
        try {
            final String tokenUsername = getUsernameFromToken(token);
            return (username.equals(tokenUsername) && !isTokenExpired(token));
        } catch (Exception e) {
            logger.error("验证JWT token失败: {}", e.getMessage());
            return false;
        }
    }

    /**
     * 验证token（无用户名参数）
     */
    public Boolean validateToken(String token) {
        return validateTokenFormat(token) && !isTokenExpired(token);
    }

    /**
     * 验证token格式
     */
    public Boolean validateTokenFormat(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (MalformedJwtException e) {
            logger.error("JWT token格式错误: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("JWT token已过期: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("不支持的JWT token: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT token参数为空: {}", e.getMessage());
        } catch (Exception e) {
            logger.error("JWT token验证失败: {}", e.getMessage());
        }
        return false;
    }

    /**
     * 刷新token
     */
    public String refreshToken(String token) {
        try {
            final Claims claims = getAllClaimsFromToken(token);
            final String username = claims.getSubject();
            
            // 检查是否为刷新token
            if (!"refresh".equals(claims.get("type"))) {
                throw new IllegalArgumentException("不是有效的刷新token");
            }
            
            return generateToken(username);
        } catch (Exception e) {
            logger.error("刷新JWT token失败: {}", e.getMessage());
            throw new RuntimeException("刷新token失败", e);
        }
    }

    /**
     * 从token中获取用户ID
     */
    public Long getUserIdFromToken(String token) {
        try {
            Claims claims = getAllClaimsFromToken(token);
            Object userId = claims.get("userId");
            if (userId != null) {
                return Long.valueOf(userId.toString());
            }
            return null;
        } catch (Exception e) {
            logger.error("从token获取用户ID失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 从token中获取角色信息
     */
    public String getRoleFromToken(String token) {
        try {
            Claims claims = getAllClaimsFromToken(token);
            return (String) claims.get("role");
        } catch (Exception e) {
            logger.error("从token获取角色信息失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 从token中获取角色列表
     */
    @SuppressWarnings("unchecked")
    public java.util.List<String> getRolesFromToken(String token) {
        try {
            Claims claims = getAllClaimsFromToken(token);
            Object roles = claims.get("roles");
            if (roles instanceof java.util.List) {
                return (java.util.List<String>) roles;
            } else if (roles instanceof String) {
                return java.util.Arrays.asList((String) roles);
            }
            // 如果没有roles，尝试获取单个role
            String role = getRoleFromToken(token);
            if (role != null) {
                return java.util.Arrays.asList(role);
            }
            return new java.util.ArrayList<>();
        } catch (Exception e) {
            logger.error("从token获取角色列表失败: {}", e.getMessage());
            return new java.util.ArrayList<>();
        }
    }

    /**
     * 从token中获取组织ID
     */
    public Long getOrganizationIdFromToken(String token) {
        try {
            Claims claims = getAllClaimsFromToken(token);
            Object orgId = claims.get("organizationId");
            if (orgId != null) {
                return Long.valueOf(orgId.toString());
            }
            return null;
        } catch (Exception e) {
            logger.error("从token获取组织ID失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 获取token剩余有效时间（毫秒）
     */
    public Long getTokenRemainingTime(String token) {
        try {
            Date expiration = getExpirationDateFromToken(token);
            Date now = new Date();
            return expiration.getTime() - now.getTime();
        } catch (Exception e) {
            return 0L;
        }
    }

    /**
     * 检查token是否即将过期（30分钟内）
     */
    public Boolean isTokenExpiringSoon(String token) {
        try {
            Long remainingTime = getTokenRemainingTime(token);
            return remainingTime != null && remainingTime < 30 * 60 * 1000; // 30分钟
        } catch (Exception e) {
            return true;
        }
    }
}