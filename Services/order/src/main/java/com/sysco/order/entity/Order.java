package com.sysco.order.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.cglib.core.Local;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer orderId ;

    private Integer customerId;
    private LocalDateTime orderDate ;
    private OrderStatus orderStatus ;
    private PaymentStatus paymentStatus ;
    private Float totalAmount ;
    private ShippingAddress shippingAddress ;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    private LocalDateTime createdAt ;
    private LocalDateTime updatedAt ;
}
