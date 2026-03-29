package com.sysco.order.dto.request;

import com.sysco.order.entity.OrderItem;
import com.sysco.order.entity.OrderStatus;
import com.sysco.order.entity.PaymentStatus;
import com.sysco.order.entity.ShippingAddress;
import jakarta.persistence.CascadeType;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderRequestDto {

    @NotNull(message = "Customer Id is required")
    private Integer customerId;

    @NotNull(message = "Shipping Address is required")
    private ShippingAddress shippingAddress ;

    @NotNull(message = "Item list cannot be empty")
    private List<OrderItem> items;
}
