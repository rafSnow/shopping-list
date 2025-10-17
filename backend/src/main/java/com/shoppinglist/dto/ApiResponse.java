package com.shoppinglist.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Resposta padrão da API
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

  private boolean success;
  private T data;
  private ErrorDetails error;

  @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'")
  private LocalDateTime timestamp;

  public static <T> ApiResponse<T> success(T data) {
    return new ApiResponse<>(true, data, null, LocalDateTime.now());
  }

  public static <T> ApiResponse<T> error(ErrorDetails error) {
    return new ApiResponse<>(false, null, error, LocalDateTime.now());
  }
}
