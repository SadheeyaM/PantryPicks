package com.sysco.user.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "address" , schema = "users")
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer addressId ;

    private String line1 ;
    private String line2 ;
    private String city ;
    private String state ;
    private String country ;
    private String postalCode ;
    private AddressType type ;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user ;

}
