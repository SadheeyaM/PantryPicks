package com.sysco.order.mapper;

import com.sysco.order.dto.request.OrderRequestDto;
import com.sysco.order.dto.response.OrderCreatedResponseDto;
import com.sysco.order.dto.response.OrderItemResponseDto;
import com.sysco.order.dto.response.OrderResponseDto;
import com.sysco.order.entity.Order;
import com.sysco.order.entity.OrderStatus ;
import com.sysco.order.entity.PaymentStatus ;
import com.sysco.order.entity.OrderItem;
import lombok.experimental.UtilityClass;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@UtilityClass
public class OrderMapper {
    public static OrderCreatedResponseDto mapToCreateResponse (Order order, String message) {
        OrderCreatedResponseDto responseDto = new OrderCreatedResponseDto() ;

        responseDto.setMessage(message);
        responseDto.setOrderId(order.getOrderId());
        responseDto.setCustomerId(order.getCustomerId());
        responseDto.setTotalAmount(order.getTotalAmount());
        responseDto.setOrderDate(order.getOrderDate());
        responseDto.setOrderStatus(order.getOrderStatus());

        return responseDto ;
    }

    public static Order mapToOrder(OrderRequestDto orderRequestDto) {

        Order order = new Order();
        order.setCustomerId(orderRequestDto.getCustomerId());
        order.setShippingAddress(orderRequestDto.getShippingAddress());

        List<OrderItem> items = orderRequestDto.getItems().stream().map(itemDto -> {
            OrderItem item = new OrderItem();
            item.setProductId(itemDto.getProductId());
            item.setQuantity(itemDto.getQuantity());
            item.setPrice(itemDto.getPrice());
            item.setOrder(order); // back-reference
            return item;
        })
        .collect(Collectors.toList());

        order.setItems(items);

        order.setOrderDate(LocalDateTime.now());

        float total = (float) order.getItems().stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();

        order.setTotalAmount(total);

        order.setOrderStatus(OrderStatus.CREATED);
        order.setPaymentStatus(PaymentStatus.PENDING);

        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());

        return order;
    }

    public static OrderResponseDto mapToOrderResponse(Order order) {

        List<OrderItem> items = order.getItems().stream()
                .map(item -> {
                    OrderItem orderItem = new OrderItem();
                    orderItem.setProductId(item.getProductId());
                    orderItem.setQuantity(item.getQuantity());
                    orderItem.setPrice(item.getPrice());
                    return orderItem;
                })
                .collect(Collectors.toList()); // use mutable list

        return OrderResponseDto.builder()
                .orderId(order.getOrderId())
                .customerId(order.getCustomerId())
                .orderDate(order.getOrderDate())
                .orderStatus(order.getOrderStatus())
                .paymentStatus(order.getPaymentStatus())
                .totalAmount(order.getTotalAmount())
                .shippingAddress(order.getShippingAddress())
                .items(items) // now correctly set
                .build();
    }
}
