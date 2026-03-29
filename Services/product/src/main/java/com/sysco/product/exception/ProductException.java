package com.sysco.product.exception;

import org.springframework.http.HttpStatus;


public class ProductException extends RuntimeException {

    private final String errorCode;
    private final HttpStatus httpStatus;

    public ProductException(String errorCode, String message, HttpStatus httpStatus) {
        super(message);
        this.errorCode = errorCode;
        this.httpStatus = httpStatus;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }
}