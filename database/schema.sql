-- =========================================
-- Shopping List Database Schema
-- PostgreSQL 15+
-- =========================================

-- Criar extensão para UUID (se não existir)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de itens
CREATE TABLE ITEMS (
  ID UUID PRIMARY KEY DEFAULT UUID_GENERATE_V4(),
  NAME VARCHAR(200) NOT NULL,
  CREATED_AT TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UPDATED_AT TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  DELETED_AT TIMESTAMP NULL,
  CONSTRAINT NAME_NOT_EMPTY CHECK (LENGTH(TRIM(NAME)) > 0)
);

-- Índices para performance
CREATE INDEX IDX_ITEMS_DELETED_AT ON ITEMS(DELETED_AT) WHERE DELETED_AT IS NULL;

CREATE INDEX IDX_ITEMS_UPDATED_AT ON ITEMS(UPDATED_AT DESC);

CREATE INDEX IDX_ITEMS_NAME ON ITEMS(NAME) WHERE DELETED_AT IS NULL;

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_items_updated_at
    BEFORE UPDATE ON items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comentários para documentação
COMMENT ON TABLE items IS 'Tabela de itens da lista de compras';
COMMENT ON COLUMN items.id IS 'Identificador único UUID';
COMMENT ON COLUMN items.name IS 'Nome do produto (1-200 caracteres)';
COMMENT ON COLUMN items.created_at IS 'Data/hora de criação do item';
COMMENT ON COLUMN items.updated_at IS 'Data/hora da última atualização';
COMMENT ON COLUMN items.deleted_at IS 'Soft delete - NULL para itens ativos';

-- Dados de exemplo (opcional, para testes)
-- INSERT INTO items (name) VALUES 
--     ('Leite'),
--     ('Pão'),
--     ('Arroz'),
--     ('Feijão'),
--     ('Café');

-- Consultas úteis

-- Buscar todos os itens ativos
-- SELECT id, name, created_at, updated_at
-- FROM items
-- WHERE deleted_at IS NULL
-- ORDER BY created_at DESC;

-- Estatísticas
-- SELECT 
--     COUNT(*) FILTER (WHERE deleted_at IS NULL) as items_ativos,
--     COUNT(*) FILTER (WHERE deleted_at IS NOT NULL) as items_deletados,
--     COUNT(*) as total
-- FROM items;

-- Cleanup de itens antigos (executar periodicamente)
-- DELETE FROM items
-- WHERE deleted_at IS NOT NULL
--   AND deleted_at < CURRENT_TIMESTAMP - INTERVAL '30 days';