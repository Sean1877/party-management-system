package com.party.repository;

import com.party.entity.Organization;
import com.party.entity.PartyMember;
import com.party.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * 党员Repository接口
 */
@Repository
public interface PartyMemberRepository extends JpaRepository<PartyMember, Long> {
    
    /**
     * 根据用户查询党员信息
     * @param user 用户
     * @return 党员信息
     */
    Optional<PartyMember> findByUser(User user);
    
    /**
     * 根据党员编号查询党员
     * @param memberNumber 党员编号
     * @return 党员信息
     */
    Optional<PartyMember> findByMemberNumber(String memberNumber);
    
    /**
     * 根据组织查询党员列表
     * @param organization 组织
     * @return 党员列表
     */
    List<PartyMember> findByOrganization(Organization organization);
    
    /**
     * 根据党员类型查询党员列表
     * @param memberType 党员类型
     * @return 党员列表
     */
    List<PartyMember> findByMemberType(PartyMember.MemberType memberType);
    
    /**
     * 根据状态查询党员列表
     * @param status 状态
     * @return 党员列表
     */
    List<PartyMember> findByStatus(PartyMember.MemberStatus status);
    
    /**
     * 根据组织和党员类型查询党员列表
     * @param organization 组织
     * @param memberType 党员类型
     * @return 党员列表
     */
    List<PartyMember> findByOrganizationAndMemberType(Organization organization, 
                                                      PartyMember.MemberType memberType);
    
    /**
     * 根据组织和状态查询党员列表
     * @param organization 组织
     * @param status 状态
     * @return 党员列表
     */
    List<PartyMember> findByOrganizationAndStatus(Organization organization, 
                                                  PartyMember.MemberStatus status);
    
    /**
     * 查询入党日期在指定范围内的党员
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 党员列表
     */
    List<PartyMember> findByJoinDateBetween(LocalDate startDate, LocalDate endDate);
    
    /**
     * 查询预备期即将到期的党员
     * @param endDate 截止日期
     * @return 党员列表
     */
    @Query("SELECT pm FROM PartyMember pm WHERE pm.memberType = 'PROBATIONARY' " +
           "AND pm.status = 'ACTIVE' AND pm.probationEndDate <= :endDate")
    List<PartyMember> findProbationExpiringMembers(@Param("endDate") LocalDate endDate);
    
    /**
     * 查询预备期已过期的党员
     * @param currentDate 当前日期
     * @return 党员列表
     */
    @Query("SELECT pm FROM PartyMember pm WHERE pm.memberType = 'PROBATIONARY' " +
           "AND pm.status = 'ACTIVE' AND pm.probationEndDate < :currentDate")
    List<PartyMember> findExpiredProbationMembers(@Param("currentDate") LocalDate currentDate);
    
    /**
     * 统计各组织的党员数量
     * @return 统计结果
     */
    @Query("SELECT pm.organization, COUNT(pm) FROM PartyMember pm " +
           "WHERE pm.status = 'ACTIVE' GROUP BY pm.organization")
    List<Object[]> countMembersByOrganization();
    
    /**
     * 统计各党员类型的数量
     * @return 统计结果
     */
    @Query("SELECT pm.memberType, COUNT(pm) FROM PartyMember pm " +
           "WHERE pm.status = 'ACTIVE' GROUP BY pm.memberType")
    List<Object[]> countMembersByType();
    
    /**
     * 统计指定组织各党员类型的数量
     * @param organization 组织
     * @return 统计结果
     */
    @Query("SELECT pm.memberType, COUNT(pm) FROM PartyMember pm " +
           "WHERE pm.organization = :organization AND pm.status = 'ACTIVE' " +
           "GROUP BY pm.memberType")
    List<Object[]> countMembersByTypeInOrganization(@Param("organization") Organization organization);
    
    /**
     * 查询指定年份入党的党员数量
     * @param year 年份
     * @return 党员数量
     */
    @Query("SELECT COUNT(pm) FROM PartyMember pm WHERE YEAR(pm.joinDate) = :year")
    long countMembersJoinedInYear(@Param("year") Integer year);
    
    /**
     * 查询党龄在指定范围内的党员
     * @param minYears 最小党龄
     * @param maxYears 最大党龄
     * @return 党员列表
     */
    @Query("SELECT pm FROM PartyMember pm WHERE pm.memberType = 'FORMAL' " +
           "AND pm.status = 'ACTIVE' " +
           "AND YEAR(CURRENT_DATE) - YEAR(pm.joinDate) BETWEEN :minYears AND :maxYears")
    List<PartyMember> findMembersByPartyAge(@Param("minYears") Integer minYears, 
                                           @Param("maxYears") Integer maxYears);
    
    /**
     * 查询生日在指定月份的党员
     * @param month 月份
     * @return 党员列表
     */
    @Query("SELECT pm FROM PartyMember pm JOIN pm.user u " +
           "WHERE pm.status = 'ACTIVE' AND MONTH(u.birthDate) = :month")
    List<PartyMember> findMembersBirthdayInMonth(@Param("month") Integer month);
    
    /**
     * 查询入党纪念日在指定月份的党员
     * @param month 月份
     * @return 党员列表
     */
    @Query("SELECT pm FROM PartyMember pm WHERE pm.status = 'ACTIVE' " +
           "AND MONTH(pm.joinDate) = :month")
    List<PartyMember> findMembersJoinAnniversaryInMonth(@Param("month") Integer month);
    
    /**
     * 检查党员编号是否已存在
     * @param memberNumber 党员编号
     * @return 是否存在
     */
    boolean existsByMemberNumber(String memberNumber);
    
    /**
     * 检查用户是否已是党员
     * @param user 用户
     * @return 是否已是党员
     */
    boolean existsByUser(User user);
    
    /**
     * 查询活跃党员总数
     * @return 活跃党员数量
     */
    long countByStatus(PartyMember.MemberStatus status);
    
    /**
     * 查询指定组织的活跃党员数量
     * @param organization 组织
     * @param status 状态
     * @return 党员数量
     */
    long countByOrganizationAndStatus(Organization organization, PartyMember.MemberStatus status);
    
    /**
     * 查询最近加入的党员
     * @param limit 限制数量
     * @return 党员列表
     */
    @Query("SELECT pm FROM PartyMember pm WHERE pm.status = 'ACTIVE' " +
           "ORDER BY pm.joinDate DESC, pm.createdAt DESC")
    List<PartyMember> findRecentJoinedMembers();
}