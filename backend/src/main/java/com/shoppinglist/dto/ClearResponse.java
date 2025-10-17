package com.shoppinglist.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para resposta de limpeza de lista
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClearResponse {

  private String message;
  private int deletedCount;
}
