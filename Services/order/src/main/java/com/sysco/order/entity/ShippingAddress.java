package com.sysco.order.entity;

import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class ShippingAddress {
    private String line1 ;
    private String line2 ;
    private String city ;
    private String state ;
    private String country ;
    private String postalCode ;
}
