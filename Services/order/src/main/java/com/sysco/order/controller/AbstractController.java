package com.sysco.order.controller;
import com.sysco.order.dto.error.ErrorDto;
import com.sysco.order.dto.response.ResponseObject;
import com.sysco.order.exception.DatabaseException;
import com.sysco.order.exception.OrderCreationException;
import com.sysco.order.exception.OrderNotFoundException;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.List;

@Log4j2
@ControllerAdvice
public class AbstractController {

    protected <T> ResponseEntity<ResponseObject> sendSuccessResponse(T response) {
        return sendResponse(response, HttpStatus.OK);
    }

    protected <T> ResponseEntity<ResponseObject> sendCreatedResponse(T response) {
        return sendResponse(response, HttpStatus.CREATED);
    }

    protected <T> ResponseEntity<ResponseObject> sendBadRequestResponse(T response) {
        return sendResponse(response, HttpStatus.BAD_REQUEST);
    }

    protected ResponseEntity<Void> sendNoContentResponse() {
        return ResponseEntity.noContent().build();
    }

    protected <T> ResponseEntity<ResponseObject> sendResponse(T response, HttpStatus httpStatus) {
        ResponseObject responseBody = new ResponseObject();
        responseBody.setObject(response);
        responseBody.setStatus(httpStatus);
        return new ResponseEntity<>(responseBody, httpStatus);
    }

    @ResponseBody
    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    protected ResponseEntity<ResponseObject> handleMethodArgumentNotValidException(MethodArgumentNotValidException exception) {
        log.error("MethodArgumentNotValidException occurred", exception);

        log.error("VALIDATION_ERROR", exception);
        List<String> errors = exception.getBindingResult().getFieldErrors()
                .stream().map(FieldError::getDefaultMessage).toList();

        return sendBadRequestResponse(new ErrorDto("VALIDATION_ERROR", errors.toString()));
    }

    @ExceptionHandler(OrderCreationException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ResponseBody
    public ResponseEntity<ResponseObject> handleOrderCreationException(OrderCreationException ex) {
        log.error("PRODUCT_CREATION_ERROR", ex);
        return sendBadRequestResponse(new ErrorDto("PRODUCT_CREATION_ERROR", ex.getMessage()));
    }

    @ExceptionHandler(DatabaseException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ResponseBody
    public ResponseEntity<ResponseObject> handleDatabaseException(DatabaseException ex) {
        log.error("DATABASE_ERROR", ex);
        return sendBadRequestResponse(new ErrorDto("DATABASE_ERROR", ex.getMessage()));
    }

    @ExceptionHandler(OrderNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ResponseBody
    public ResponseEntity<ResponseObject> handleOrderNotFoundException(OrderNotFoundException ex) {
        log.error("NOT_FOUND", ex);
        return sendBadRequestResponse(new ErrorDto("NOT_FOUND", ex.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ResponseBody
    public ResponseEntity<ResponseObject> handleGenericException(Exception ex) {
        log.error("UNEXPECTED_ERROR", ex);
        return sendBadRequestResponse(new ErrorDto("UNEXPECTED_ERROR", ex.getMessage()));
    }
}
