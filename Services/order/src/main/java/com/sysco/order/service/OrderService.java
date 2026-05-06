package com.sysco.order.service;

import com.sysco.order.dto.request.OrderPatchRequestDto;
import com.sysco.order.dto.request.OrderRequestDto;
import com.sysco.order.dto.response.OrderCreatedResponseDto;
import com.sysco.order.dto.response.OrderResponseDto;
import com.sysco.order.dto.response.ResponseObject;

import java.util.List;

public interface OrderService {
    OrderCreatedResponseDto createOrder(OrderRequestDto orderRequestDto) ;

    List<OrderResponseDto> getAllOrders() ;

    ResponseObject getOrdersByCustomerId(Integer customerId) ;

    ResponseObject getOrderById(Integer orderId) ;

    ResponseObject updateOrder(Integer orderId, OrderPatchRequestDto orderPatchRequestDto) ;
}
