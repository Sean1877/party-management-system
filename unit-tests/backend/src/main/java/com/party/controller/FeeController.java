package com.party.controller;

import com.party.entity.FeePayment;
import com.party.entity.FeeStandard;
import com.party.service.impl.FeePaymentServiceImpl;
import com.party.service.impl.FeeStandardServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/fees")
@CrossOrigin(origins = "*")
public class FeeController {

    @Autowired
    private FeePaymentServiceImpl feePaymentService;

    @Autowired
    private FeeStandardServiceImpl feeStandardService;

    // 党费标准管理
    @GetMapping("/standards")
    public ResponseEntity<Map<String, Object>> getAllFeeStandards(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Map<String, Object> response = new HashMap<>();
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<FeeStandard> standards = feeStandardService.findAll(pageable);
            
            response.put("success", true);
            response.put("data", standards);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "获取党费标准失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PostMapping("/standards")
    public ResponseEntity<Map<String, Object>> createFeeStandard(@RequestBody FeeStandard feeStandard) {
        Map<String, Object> response = new HashMap<>();
        try {
            FeeStandard savedStandard = feeStandardService.save(feeStandard);
            response.put("success", true);
            response.put("data", savedStandard);
            response.put("message", "党费标准创建成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "创建党费标准失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PutMapping("/standards/{id}")
    public ResponseEntity<Map<String, Object>> updateFeeStandard(@PathVariable Long id, @RequestBody FeeStandard feeStandard) {
        Map<String, Object> response = new HashMap<>();
        try {
            feeStandard.setId(id);
            FeeStandard updatedStandard = feeStandardService.save(feeStandard);
            response.put("success", true);
            response.put("data", updatedStandard);
            response.put("message", "党费标准更新成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "更新党费标准失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @DeleteMapping("/standards/{id}")
    public ResponseEntity<Map<String, Object>> deleteFeeStandard(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            feeStandardService.deleteById(id);
            response.put("success", true);
            response.put("message", "党费标准删除成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "删除党费标准失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    // 党费缴费管理
    @GetMapping("/payments")
    public ResponseEntity<Map<String, Object>> getAllFeePayments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Map<String, Object> response = new HashMap<>();
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<FeePayment> payments = feePaymentService.findAll(pageable);
            
            response.put("success", true);
            response.put("data", payments);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "获取缴费记录失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PostMapping("/payments")
    public ResponseEntity<Map<String, Object>> createFeePayment(@RequestBody FeePayment feePayment) {
        Map<String, Object> response = new HashMap<>();
        try {
            FeePayment savedPayment = feePaymentService.save(feePayment);
            response.put("success", true);
            response.put("data", savedPayment);
            response.put("message", "缴费记录创建成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "创建缴费记录失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/payments/{id}")
    public ResponseEntity<Map<String, Object>> getFeePaymentById(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Optional<FeePayment> payment = feePaymentService.findById(id);
            if (payment.isPresent()) {
                response.put("success", true);
                response.put("data", payment.get());
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "缴费记录不存在");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "获取缴费记录失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PutMapping("/payments/{id}")
    public ResponseEntity<Map<String, Object>> updateFeePayment(@PathVariable Long id, @RequestBody FeePayment feePayment) {
        Map<String, Object> response = new HashMap<>();
        try {
            feePayment.setId(id);
            FeePayment updatedPayment = feePaymentService.save(feePayment);
            response.put("success", true);
            response.put("data", updatedPayment);
            response.put("message", "缴费记录更新成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "更新缴费记录失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @DeleteMapping("/payments/{id}")
    public ResponseEntity<Map<String, Object>> deleteFeePayment(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            feePaymentService.deleteById(id);
            response.put("success", true);
            response.put("message", "缴费记录删除成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "删除缴费记录失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/payments/user/{userId}")
    public ResponseEntity<Map<String, Object>> getFeePaymentsByUserId(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Map<String, Object> response = new HashMap<>();
        try {
            // 这里应该实现按用户ID查询缴费记录的逻辑
            Pageable pageable = PageRequest.of(page, size);
            Page<FeePayment> payments = feePaymentService.findAll(pageable);
            
            response.put("success", true);
            response.put("data", payments);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "获取用户缴费记录失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getFeeStatistics() {
        Map<String, Object> response = new HashMap<>();
        try {
            // 这里应该实现统计逻辑
            Map<String, Object> statistics = new HashMap<>();
            statistics.put("totalAmount", 0);
            statistics.put("totalPayments", 0);
            statistics.put("unpaidCount", 0);
            
            response.put("success", true);
            response.put("data", statistics);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "获取统计数据失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}