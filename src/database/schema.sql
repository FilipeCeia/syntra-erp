# ====================================
# src/database/schema.sql
# ====================================
-- Schema completo do banco de dados
CREATE DATABASE IF NOT EXISTS syntra_erp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE syntra_erp;

-- Trigger para atualizar updated_at automaticamente
DELIMITER $$
CREATE TRIGGER trigger_updated_at BEFORE UPDATE ON users
FOR EACH ROW BEGIN
    SET NEW.updatedAt = CURRENT_TIMESTAMP;
END$$
DELIMITER ;

-- Índices adicionais para performance
CREATE INDEX idx_client_tenant ON users(client_id);
CREATE INDEX idx_email_lookup ON users(email);
CREATE INDEX idx_session_lookup ON users(email, senha);

-- View para relatórios de vendas
CREATE VIEW vw_vendas_resumo AS
SELECT 
    v.client_id,
    v.loja_id,
    DATE(v.data_venda) as data,
    COUNT(*) as total_vendas,
    SUM(v.total) as valor_total,
    AVG(v.total) as ticket_medio
FROM vendas v
WHERE v.status IN (1, 2)
GROUP BY v.client_id, v.loja_id, DATE(v.data_venda);

-- View para controlo de stock
CREATE VIEW vw_stock_atual AS
SELECT 
    a.client_id,
    a.id as artigo_id,
    a.nome,
    a.stock_atual,
    a.stock_minimo,
    a.stock_maximo,
    CASE 
        WHEN a.stock_atual <= a.stock_minimo THEN 'BAIXO'
        WHEN a.stock_atual >= a.stock_maximo THEN 'ALTO'
        ELSE 'NORMAL'
    END as status_stock
FROM artigos a
WHERE a.status = 1 AND a.controla_stock = 1;

-- Procedures para operações comuns
DELIMITER $$
CREATE PROCEDURE sp_movimentar_stock(
    IN p_artigo_id BIGINT,
    IN p_quantidade DECIMAL(10,2),
    IN p_tipo_movimento TINYINT,
    IN p_documento_origem VARCHAR(50),
    IN p_user_id BIGINT,
    IN p_observacoes TEXT
)
BEGIN
    DECLARE v_stock_anterior DECIMAL(10,2);
    DECLARE v_stock_atual DECIMAL(10,2);
    
    -- Buscar stock atual
    SELECT stock_atual INTO v_stock_anterior 
    FROM artigos 
    WHERE id = p_artigo_id;
    
    -- Calcular novo stock
    SET v_stock_atual = v_stock_anterior + p_quantidade;
    
    -- Atualizar stock do artigo
    UPDATE artigos 
    SET stock_atual = v_stock_atual 
    WHERE id = p_artigo_id;
    
    -- Registrar movimento
    INSERT INTO estoques (
        artigo_id, tipo_movimento, documento_origem,
        quantidade_anterior, quantidade, quantidade_atual,
        user_id, observacoes, data_movimento
    ) VALUES (
        p_artigo_id, p_tipo_movimento, p_documento_origem,
        v_stock_anterior, p_quantidade, v_stock_atual,
        p_user_id, p_observacoes, NOW()
    );
END$$
DELIMITER ;