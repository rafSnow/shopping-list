package com.shoppinglist.controller;

import com.shoppinglist.dto.*;
import com.shoppinglist.service.ItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * Controller REST para gerenciamento de itens
 */
@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*") // Configurado via properties, mas mantendo para dev
public class ItemController {

  private final ItemService itemService;

  /**
   * GET /api/items - Retorna todos os itens ativos
   */
  @GetMapping
  public ResponseEntity<ApiResponse<ListResponse>> getAllItems() {
    log.debug("GET /api/items");
    ListResponse response = itemService.getAllItems();
    return ResponseEntity.ok(ApiResponse.success(response));
  }

  /**
   * POST /api/items - Adiciona novo item
   */
  @PostMapping
  public ResponseEntity<ApiResponse<ItemDTO>> addItem(@Valid @RequestBody ItemCreateRequest request) {
    log.debug("POST /api/items - name: {}", request.getName());
    ItemDTO item = itemService.addItem(request);
    return ResponseEntity
        .status(HttpStatus.CREATED)
        .body(ApiResponse.success(item));
  }

  /**
   * DELETE /api/items/{id} - Remove item específico
   */
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> removeItem(@PathVariable UUID id) {
    log.debug("DELETE /api/items/{}", id);
    itemService.removeItem(id);
    return ResponseEntity.noContent().build();
  }

  /**
   * DELETE /api/items/clear - Limpa toda a lista
   */
  @DeleteMapping("/clear")
  public ResponseEntity<ApiResponse<ClearResponse>> clearAllItems() {
    log.debug("DELETE /api/items/clear");
    ClearResponse response = itemService.clearAllItems();
    return ResponseEntity.ok(ApiResponse.success(response));
  }
}
