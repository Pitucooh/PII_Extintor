BEGIN;

CREATE TABLE IF NOT EXISTS metro.extintores
(
    patrimonio text COLLATE pg_catalog."default" NOT NULL,
    num_equip text COLLATE pg_catalog."default",
    tipo text COLLATE pg_catalog."default",
    capacidade text COLLATE pg_catalog."default",
    fabricante text COLLATE pg_catalog."default",
    prox_ret integer,
    data_insp text COLLATE pg_catalog."default",
    prox_rec date,
    nao_conf text COLLATE pg_catalog."default",
    id_local integer,
    qr_code integer,
    observacao text COLLATE pg_catalog."default",
    PRIMARY KEY (patrimonio)
);

CREATE TABLE IF NOT EXISTS metro.hist_manutencao
(
    id_manutencao integer NOT NULL,
    patrimonio text COLLATE pg_catalog."default" NOT NULL,
    data_manu date NOT NULL,
    "desc" text COLLATE pg_catalog."default",
    resp text COLLATE pg_catalog."default" NOT NULL,
    observacoes text COLLATE pg_catalog."default",
    PRIMARY KEY (id_manutencao)
);

CREATE TABLE IF NOT EXISTS metro.localizacoes
(
    id_local integer NOT NULL,
    setor text COLLATE pg_catalog."default",
    area text COLLATE pg_catalog."default",
    gerencia text COLLATE pg_catalog."default",
    predio text COLLATE pg_catalog."default",
    local text COLLATE pg_catalog."default",
    observacoes text COLLATE pg_catalog."default",
    CONSTRAINT localizacoes_pkey PRIMARY KEY (id_local)
);

ALTER TABLE IF EXISTS metro.extintores
    ADD CONSTRAINT id_local FOREIGN KEY (id_local)
    REFERENCES metro.localizacoes (id_local) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS metro.hist_manutencao
    ADD FOREIGN KEY (patrimonio)
    REFERENCES metro.extintores (patrimonio) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;

END;