package com.shoppinglist.exception;

/**
 * Exceção lançada quando item não é encontrado
 */
public class ItemNotFoundException extends RuntimeException {

  public ItemNotFoundException(String message) {
    super(message);
  }
}
