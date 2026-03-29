package com.sysco.order.dto.request;

import com.sysco.order.entity.OrderItem;
import com.sysco.order.entity.OrderStatus;
import com.sysco.order.entity.PaymentStatus;
import com.sysco.order.entity.ShippingAddress;
import jakarta.persistence.CascadeType;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderPatchRequestDto {
    private OrderStatus orderStatus ;
    private PaymentStatus paymentStatus ;
}
