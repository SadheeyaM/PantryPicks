package com.sysco.product.dto.response;

import lombok.Data;
import org.springframework.http.HttpStatus;

@Data
public class ResponseObject {
    private Object data;
    private HttpStatus status ;
}
