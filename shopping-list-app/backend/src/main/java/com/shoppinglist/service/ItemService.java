package com.shoppinglist.service;

import com.shoppinglist.dto.*;
import com.shoppinglist.exception.ItemNotFoundException;
import com.shoppinglist.model.Item;
import com.shoppinglist.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service para lógica de negócio de itens
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ItemService {

  private final ItemRepository itemRepository;
  private final SimpMessagingTemplate messagingTemplate;

  /**
   * Busca todos os itens ativos
   */
  @Transactional(readOnly = true)
  public ListResponse getAllItems() {
    log.debug("Buscando todos os itens ativos");
    List<Item> items = itemRepository.findAllActive();
    List<ItemDTO> itemDTOs = items.stream()
        .map(this::convertToDTO)
        .collect(Collectors.toList());

    return new ListResponse(itemDTOs, itemDTOs.size());
  }

  /**
   * Adiciona novo item
   */
  @Transactional
  public ItemDTO addItem(ItemCreateRequest request) {
    log.info("Adicionando item: {}", request.getName());

    String trimmedName = request.getName().trim();
    Item item = new Item(trimmedName);
    Item savedItem = itemRepository.save(item);

    ItemDTO itemDTO = convertToDTO(savedItem);

    // Notificar via WebSocket
    notifyClients("ITEM_ADDED", itemDTO);

    return itemDTO;
  }

  /**
   * Remove item específico (soft delete)
   */
  @Transactional
  public void removeItem(UUID id) {
    log.info("Removendo item: {}", id);

    Item item = itemRepository.findById(id)
        .orElseThrow(() -> new ItemNotFoundException("Item não encontrado: " + id));

    if (item.isDeleted()) {
      throw new ItemNotFoundException("Item já foi removido: " + id);
    }

    item.markAsDeleted();
    itemRepository.save(item);

    // Notificar via WebSocket
    notifyClients("ITEM_REMOVED", new ItemRemovedDTO(id.toString()));
  }

  /**
   * Limpa todos os itens (soft delete)
   */
  @Transactional
  public ClearResponse clearAllItems() {
    log.info("Limpando toda a lista");

    List<Item> activeItems = itemRepository.findAllActive();
    int count = activeItems.size();

    LocalDateTime now = LocalDateTime.now();
    activeItems.forEach(item -> item.setDeletedAt(now));
    itemRepository.saveAll(activeItems);

    // Notificar via WebSocket
    notifyClients("LIST_CLEARED", new ClearNotificationDTO(count));

    String message = count > 0
        ? "Lista limpa com sucesso"
        : "Lista já estava vazia";

    return new ClearResponse(message, count);
  }

  /**
   * Converte Item para ItemDTO
   */
  private ItemDTO convertToDTO(Item item) {
    return new ItemDTO(
        item.getId().toString(),
        item.getName(),
        item.getCreatedAt(),
        item.getUpdatedAt());
  }

  /**
   * Notifica clientes via WebSocket
   */
  private void notifyClients(String type, Object data) {
    try {
      WebSocketMessage message = new WebSocketMessage(type, data, LocalDateTime.now());
      messagingTemplate.convertAndSend("/topic/items", message);
      log.debug("Notificação enviada: {}", type);
    } catch (Exception e) {
      log.error("Erro ao enviar notificação WebSocket", e);
    }
  }

  /**
   * DTO para notificação de item removido
   */
  @lombok.Data
  @lombok.AllArgsConstructor
  private static class ItemRemovedDTO {
    private String id;
  }

  /**
   * DTO para notificação de lista limpa
   */
  @lombok.Data
  @lombok.AllArgsConstructor
  private static class ClearNotificationDTO {
    private int deletedCount;
  }

  /**
   * Mensagem WebSocket
   */
  @lombok.Data
  @lombok.AllArgsConstructor
  private static class WebSocketMessage {
    private String type;
    private Object data;
    private LocalDateTime timestamp;
  }
}
