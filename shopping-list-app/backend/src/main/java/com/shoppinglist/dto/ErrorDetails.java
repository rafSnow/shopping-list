package com.shoppinglist.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * Detalhes de erro para respostas da API
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorDetails {

  private String code;
  private String message;
  private Map<String, Object> details;

  public ErrorDetails(String code, String message) {
    this.code = code;
    this.message = message;
  }
}
