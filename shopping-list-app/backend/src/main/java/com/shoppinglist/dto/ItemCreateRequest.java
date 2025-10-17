package com.shoppinglist.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para requisição de criação de Item
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemCreateRequest {

  @NotBlank(message = "Nome não pode ser vazio")
  @Size(max = 200, message = "Nome não pode exceder 200 caracteres")
  private String name;
}
