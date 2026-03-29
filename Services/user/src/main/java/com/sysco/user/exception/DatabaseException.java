package com.sysco.user.exception;

public class DatabaseException extends RuntimeException {
  public DatabaseException(String message) {
    super(message);
  }
}
