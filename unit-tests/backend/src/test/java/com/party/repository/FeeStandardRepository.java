package com.party.repository;

import com.party.entity.FeeStandard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

/**
 * 党费标准数据访问接口
 */
@Repository
public interface FeeStandardRepository extends JpaRepository<FeeStandard, Long> {
    
    /**
     * 根据状态查找党费标准
     */
    List<FeeStandard> findByStatus(String status);
    
    /**
     * 根据收入范围查找适用的党费标准
     */
    @Query("SELECT fs FROM FeeStandard fs WHERE fs.minIncome <= :income AND fs.maxIncome >= :income AND fs.status = 'ACTIVE'")
    List<FeeStandard> findByIncomeRange(@Param("income") BigDecimal income);
    
    /**
     * 查找所有激活状态的党费标准，按最小收入排序
     */
    @Query("SELECT fs FROM FeeStandard fs WHERE fs.status = 'ACTIVE' ORDER BY fs.minIncome ASC")
    List<FeeStandard> findActiveStandardsOrderByMinIncome();
    
    /**
     * 根据名称查找党费标准
     */
    List<FeeStandard> findByNameContaining(String name);
    
    /**
     * 检查指定收入范围是否与现有标准重叠
     */
    @Query("SELECT COUNT(fs) FROM FeeStandard fs WHERE fs.status = 'ACTIVE' AND " +
           "((fs.minIncome <= :minIncome AND fs.maxIncome >= :minIncome) OR " +
           "(fs.minIncome <= :maxIncome AND fs.maxIncome >= :maxIncome) OR " +
           "(fs.minIncome >= :minIncome AND fs.maxIncome <= :maxIncome))")
    Long countOverlappingStandards(@Param("minIncome") BigDecimal minIncome, @Param("maxIncome") BigDecimal maxIncome);
    
    /**
     * 根据费率范围查找党费标准
     */
    @Query("SELECT fs FROM FeeStandard fs WHERE fs.feeRate BETWEEN :minRate AND :maxRate")
    List<FeeStandard> findByFeeRateRange(@Param("minRate") BigDecimal minRate, @Param("maxRate") BigDecimal maxRate);
    
    /**
     * 查找固定金额大于指定值的党费标准
     */
    List<FeeStandard> findByFixedAmountGreaterThan(BigDecimal amount);
    
    /**
     * 统计指定状态的党费标准数量
     */
    Long countByStatus(String status);
}