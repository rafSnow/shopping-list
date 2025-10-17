package com.shoppinglist.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entidade Item - Representa um item da lista de compras
 */
@Entity
@Table(name = "items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Item {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(nullable = false, length = 200)
  private String name;

  @CreationTimestamp
  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at", nullable = false)
  private LocalDateTime updatedAt;

  @Column(name = "deleted_at")
  private LocalDateTime deletedAt;

  /**
   * Construtor para criar item com nome
   */
  public Item(String name) {
    this.name = name;
  }

  /**
   * Verifica se o item está deletado (soft delete)
   */
  public boolean isDeleted() {
    return deletedAt != null;
  }

  /**
   * Marca item como deletado (soft delete)
   */
  public void markAsDeleted() {
    this.deletedAt = LocalDateTime.now();
  }
}
