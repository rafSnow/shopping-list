package com.shoppinglist.repository;

import com.shoppinglist.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Repository para acesso a dados de Item
 */
@Repository
public interface ItemRepository extends JpaRepository<Item, UUID> {

  /**
   * Busca todos os itens não deletados
   */
  @Query("SELECT i FROM Item i WHERE i.deletedAt IS NULL ORDER BY i.createdAt DESC")
  List<Item> findAllActive();

  /**
   * Busca itens atualizados após determinado timestamp
   */
  @Query("SELECT i FROM Item i WHERE i.updatedAt > :since ORDER BY i.updatedAt ASC")
  List<Item> findUpdatedSince(LocalDateTime since);

  /**
   * Conta itens ativos
   */
  @Query("SELECT COUNT(i) FROM Item i WHERE i.deletedAt IS NULL")
  long countActive();
}
