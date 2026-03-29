package com.sysco.order.service.implementation;

import com.sysco.order.dto.request.OrderPatchRequestDto;
import com.sysco.order.dto.request.OrderRequestDto;
import com.sysco.order.dto.response.OrderCreatedResponseDto;
import com.sysco.order.dto.response.OrderResponseDto;
import com.sysco.order.dto.response.ResponseObject;
import com.sysco.order.entity.Order;
import com.sysco.order.exception.OrderCreationException;
import com.sysco.order.exception.OrderNotFoundException;
import com.sysco.order.mapper.OrderMapper;
import com.sysco.order.repository.OrderRepository;
import com.sysco.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

import static com.sysco.order.mapper.OrderMapper.*;

@Service
@RequiredArgsConstructor
@Log4j2
public class ServiceImpl implements OrderService {

    private final OrderRepository orderRepository ;

    @Override
    public OrderCreatedResponseDto createOrder(OrderRequestDto orderRequestDto) {
        try {
            Order order = mapToOrder(orderRequestDto) ;
            Order savedOrder = orderRepository.save(order) ;

            log.info("Order has been created successfully {}", savedOrder) ;
            return mapToCreateResponse(savedOrder,savedOrder.getOrderId()+ " created successfully") ;
        } catch (Exception exception) {
            log.error("Error occurred while creating order: {}", exception.getMessage(),exception);
            throw new OrderCreationException("Failed to create order. PLease try again later.") ;
        }
    }

    @Override
    public List<OrderResponseDto> getAllOrders() {
        List<Order> orders = orderRepository.findAll() ;
        return orders.stream().map(OrderMapper::mapToOrderResponse).toList();
    }

    @Override
    public ResponseObject getOrderById(Integer orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(()-> new OrderNotFoundException("Order with id "+ orderId + " not found"));


        return  ResponseObject.builder()
                .object(order)
                .status(HttpStatus.OK)
                .build();
    }

    @Override
    public ResponseObject updateOrder(Integer orderId, OrderPatchRequestDto orderPatchRequestDto) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(()-> new OrderNotFoundException("Order with Order Id " +orderId + " cannot be found." )) ;

        if(orderPatchRequestDto.getOrderStatus() != null) {
            order.setOrderStatus(orderPatchRequestDto.getOrderStatus());
        }

        if(orderPatchRequestDto.getPaymentStatus() != null) {
            order.setPaymentStatus(orderPatchRequestDto.getPaymentStatus());
        }

        order.setUpdatedAt(LocalDateTime.now());

        Order updatedOrder = orderRepository.save(order) ;

        OrderResponseDto responseDto = OrderMapper.mapToOrderResponse(updatedOrder) ;

        return ResponseObject.builder()
                .object(responseDto)
                .status(HttpStatus.OK)
                .build() ;

    }
}
