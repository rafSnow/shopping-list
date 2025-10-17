package com.shoppinglist.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO para resposta de lista de itens
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ListResponse {

  private List<ItemDTO> data;
  private int count;
}
