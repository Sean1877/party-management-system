package com.party.repository;

import com.party.entity.FeeStandard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * 党费标准Repository接口
 */
@Repository
public interface FeeStandardRepository extends JpaRepository<FeeStandard, Long> {
    
    /**
     * 根据状态查询党费标准
     * @param status 状态
     * @return 党费标准列表
     */
    List<FeeStandard> findByStatus(FeeStandard.FeeStandardStatus status);
    
    /**
     * 查询所有有效的党费标准
     * @return 有效的党费标准列表
     */
    List<FeeStandard> findByStatusOrderByEffectiveDateDesc(FeeStandard.FeeStandardStatus status);
    
    /**
     * 根据收入范围查询适用的党费标准
     * @param income 收入金额
     * @param effectiveDate 生效日期
     * @return 适用的党费标准
     */
    @Query("SELECT fs FROM FeeStandard fs WHERE fs.status = 'ACTIVE' " +
           "AND fs.effectiveDate <= :effectiveDate " +
           "AND (fs.incomeMin IS NULL OR fs.incomeMin <= :income) " +
           "AND (fs.incomeMax IS NULL OR fs.incomeMax >= :income) " +
           "ORDER BY fs.effectiveDate DESC")
    List<FeeStandard> findApplicableStandards(@Param("income") BigDecimal income, 
                                             @Param("effectiveDate") LocalDate effectiveDate);
    
    /**
     * 根据收入金额查询最适用的党费标准
     * @param income 收入金额
     * @return 最适用的党费标准
     */
    @Query("SELECT fs FROM FeeStandard fs WHERE fs.status = 'ACTIVE' " +
           "AND fs.effectiveDate <= CURRENT_DATE " +
           "AND (fs.incomeMin IS NULL OR fs.incomeMin <= :income) " +
           "AND (fs.incomeMax IS NULL OR fs.incomeMax >= :income) " +
           "ORDER BY fs.effectiveDate DESC")
    List<FeeStandard> findApplicableStandardsByIncome(@Param("income") BigDecimal income);
    
    /**
     * 根据收入金额查询最适用的党费标准（取第一个）
     * @param income 收入金额
     * @return 最适用的党费标准
     */
    default Optional<FeeStandard> findMostApplicableStandard(BigDecimal income) {
        List<FeeStandard> standards = findApplicableStandardsByIncome(income);
        return standards.isEmpty() ? Optional.empty() : Optional.of(standards.get(0));
    }
    
    /**
     * 根据生效日期范围查询党费标准
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 党费标准列表
     */
    @Query("SELECT fs FROM FeeStandard fs WHERE fs.effectiveDate BETWEEN :startDate AND :endDate " +
           "ORDER BY fs.effectiveDate DESC")
    List<FeeStandard> findByEffectiveDateBetween(@Param("startDate") LocalDate startDate, 
                                                @Param("endDate") LocalDate endDate);
    
    /**
     * 根据名称查询党费标准
     * @param name 名称
     * @return 党费标准
     */
    Optional<FeeStandard> findByName(String name);
    
    /**
     * 根据名称模糊查询党费标准
     * @param name 名称关键字
     * @return 党费标准列表
     */
    List<FeeStandard> findByNameContainingIgnoreCase(String name);
    
    /**
     * 查询指定日期之前生效的最新党费标准
     * @param date 指定日期
     * @return 党费标准列表
     */
    @Query("SELECT fs FROM FeeStandard fs WHERE fs.status = 'ACTIVE' " +
           "AND fs.effectiveDate <= :date " +
           "ORDER BY fs.effectiveDate DESC")
    List<FeeStandard> findEffectiveStandardsBeforeDate(@Param("date") LocalDate date);
    
    /**
     * 检查是否存在重叠的收入范围
     * @param incomeMin 最小收入
     * @param incomeMax 最大收入
     * @param effectiveDate 生效日期
     * @param excludeId 排除的ID（用于更新时检查）
     * @return 是否存在重叠
     */
    @Query("SELECT COUNT(fs) > 0 FROM FeeStandard fs WHERE fs.status = 'ACTIVE' " +
           "AND fs.effectiveDate = :effectiveDate " +
           "AND (:excludeId IS NULL OR fs.id != :excludeId) " +
           "AND ((fs.incomeMin IS NULL OR fs.incomeMin <= :incomeMax) " +
           "AND (fs.incomeMax IS NULL OR fs.incomeMax >= :incomeMin))")
    boolean existsOverlappingRange(@Param("incomeMin") BigDecimal incomeMin,
                                  @Param("incomeMax") BigDecimal incomeMax,
                                  @Param("effectiveDate") LocalDate effectiveDate,
                                  @Param("excludeId") Long excludeId);
    
    /**
     * 统计有效的党费标准数量
     * @return 有效标准数量
     */
    @Query("SELECT COUNT(fs) FROM FeeStandard fs WHERE fs.status = 'ACTIVE'")
    long countActiveStandards();
    
    /**
     * 查询最新的党费标准
     * @return 最新的党费标准列表
     */
    @Query("SELECT fs FROM FeeStandard fs WHERE fs.status = 'ACTIVE' " +
           "ORDER BY fs.effectiveDate DESC, fs.createdAt DESC")
    List<FeeStandard> findLatestStandards();
}