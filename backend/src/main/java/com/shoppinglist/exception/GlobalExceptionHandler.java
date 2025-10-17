package com.shoppinglist.exception;

import com.shoppinglist.dto.ApiResponse;
import com.shoppinglist.dto.ErrorDetails;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

/**
 * Handler global de exceções
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

  /**
   * Trata exceção de item não encontrado
   */
  @ExceptionHandler(ItemNotFoundException.class)
  public ResponseEntity<ApiResponse<Void>> handleItemNotFound(ItemNotFoundException ex) {
    log.error("Item não encontrado: {}", ex.getMessage());
    ErrorDetails error = new ErrorDetails("ITEM_NOT_FOUND", ex.getMessage());
    return ResponseEntity
        .status(HttpStatus.NOT_FOUND)
        .body(ApiResponse.error(error));
  }

  /**
   * Trata erros de validação
   */
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ApiResponse<Void>> handleValidationErrors(MethodArgumentNotValidException ex) {
    log.error("Erro de validação: {}", ex.getMessage());

    Map<String, Object> details = new HashMap<>();
    ex.getBindingResult().getAllErrors().forEach(error -> {
      String fieldName = ((FieldError) error).getField();
      String errorMessage = error.getDefaultMessage();
      details.put(fieldName, errorMessage);
    });

    ErrorDetails error = new ErrorDetails(
        "VALIDATION_ERROR",
        "Dados inválidos",
        details);

    return ResponseEntity
        .status(HttpStatus.BAD_REQUEST)
        .body(ApiResponse.error(error));
  }

  /**
   * Trata exceções genéricas
   */
  @ExceptionHandler(Exception.class)
  public ResponseEntity<ApiResponse<Void>> handleGenericException(Exception ex) {
    log.error("Erro interno: ", ex);
    ErrorDetails error = new ErrorDetails(
        "INTERNAL_ERROR",
        "Erro interno do servidor");
    return ResponseEntity
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(ApiResponse.error(error));
  }

  /**
   * Trata UUID inválido
   */
  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ApiResponse<Void>> handleIllegalArgument(IllegalArgumentException ex) {
    log.error("Argumento inválido: {}", ex.getMessage());
    ErrorDetails error = new ErrorDetails("INVALID_UUID", "ID inválido");
    return ResponseEntity
        .status(HttpStatus.BAD_REQUEST)
        .body(ApiResponse.error(error));
  }
}
