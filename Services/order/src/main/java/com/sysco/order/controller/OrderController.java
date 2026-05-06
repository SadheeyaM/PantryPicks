package com.sysco.order.controller;

import com.sysco.order.dto.request.OrderPatchRequestDto;
import com.sysco.order.dto.request.OrderRequestDto;
import com.sysco.order.dto.response.ResponseObject;
import com.sysco.order.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Log4j2
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/api/v1/orders")
public class OrderController extends AbstractController {
    private final OrderService orderService ;

    @PostMapping
    public ResponseEntity<ResponseObject> createProduct(@Valid @RequestBody OrderRequestDto orderRequestDto) {
        log.info("Received request to create order: {}", orderRequestDto);
        return sendCreatedResponse(orderService.createOrder(orderRequestDto)) ;
    }

    @GetMapping
    public ResponseEntity<ResponseObject> getAllOrders() {
        log.info("Fetching all orders");
        return sendSuccessResponse(orderService.getAllOrders()) ;
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ResponseObject> getOrdersByCustomerId(@PathVariable Integer customerId) {
        log.info("Fetching orders for customer id: {}", customerId);
        return sendSuccessResponse(orderService.getOrdersByCustomerId(customerId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseObject> getOrderById(@PathVariable Integer orderId) {
        log.info("Getting Order details of Order ID: {}", orderId);

        return sendSuccessResponse(orderService.getOrderById(orderId)) ;
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ResponseObject> updateOrderDetails(@PathVariable Integer orderId, OrderPatchRequestDto orderPatchRequestDto) {
        log.info("Updating Order details of order id : {}" , orderId) ;
        return sendSuccessResponse(orderService.updateOrder(orderId,orderPatchRequestDto)) ;
    }
}
