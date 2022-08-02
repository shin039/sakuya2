-- ============================================================================
-- MASTER TABLE DEFINITION
-- ============================================================================

-- ----------------------------------------------------------------------------
-- CREATE Staff TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS m_staff (
  staff_id serial,
  userid   varchar(20) NOT NULL, -- For Login (Uniqueue)
  passwd   text        NOT NULL, -- For Login
  name     text        NOT NULL,
  birthday date        NOT NULL,
  tel      varchar(15),
  mail     varchar(30),

  is_delete         boolean DEFAULT false,
  regist_staff      integer,
  regist_time       timestamp,
  update_staff      integer,
  update_time       timestamp,

  PRIMARY KEY (staff_id),
  UNIQUE      (userid)
);

-- ----------------------------------------------------------------------------
-- CREATE Goods, Goods Details TABLE
-- ----------------------------------------------------------------------------
-- Goods
CREATE TABLE IF NOT EXISTS m_goods (
  goods_id          serial,
  category          integer,

  name              text NOT NULL,
  maker_id          integer, -- Company Id

  is_delete         boolean DEFAULT false, -- Goods 単位のdeleteフラグ
  regist_staff      integer,
  regist_time       timestamp,
  update_staff      integer,
  update_time       timestamp,

  PRIMARY KEY (goods_id)
);

-- Goods Details ( Goods : Goods Details => 1 : 1)
CREATE TABLE IF NOT EXISTS m_goods_details (
  goods_id          integer NOT NULL,

  sales_discription text,
  sales_discript50  varchar(50),
  sales_discript100 varchar(100),
  width             numeric,
  depth             numeric,
  height            numeric,
  composition       text,
  moq               numeric, -- Minimum Order Quantity
  spq               numeric, -- Standard Packing Quantity
  discription       text,

  regist_staff      integer,
  regist_time       timestamp,
  update_staff      integer,
  update_time       timestamp,

  PRIMARY KEY (goods_id)
);

-- Goods Extra ( Goods : Goods Extra => 1 : N)
CREATE TABLE IF NOT EXISTS m_goods_sku (
  sku_id            serial,
  goods_id          integer NOT NULL,
  goods_sku_type    integer NOT NULL,

  model_no          varchar(30),
  jan               varchar(13),
  unit_cost         numeric,
  tax_rate          numeric, -- For Reduced Tax Rate
  ws_price          numeric, -- WholeSale Price (Tax Exclude)
  rt_price          numeric, -- Retail    Price (Tax Exclude)

  i01_name          integer,
  i02_name          integer,
  i03_name          integer,
  i04_name          integer,
  i05_name          integer,
  n01_name          numeric,
  n02_name          numeric,
  n03_name          numeric,
  n04_name          numeric,
  n05_name          numeric,
  t01_name          text,
  t02_name          text,
  t03_name          text,
  t04_name          text,
  t05_name          text,

  discription       text,

  is_delete         boolean DEFAULT false, -- SKU単位のdeleteフラグ
  regist_staff      integer,
  regist_time       timestamp,
  update_staff      integer,
  update_time       timestamp,

  PRIMARY KEY (sku_id),
  UNIQUE  (model_no)
);

-- ----------------------------------------------------------------------------
-- CREATE Goods Type, Goods Extra, Goods Material TABLE
-- ----------------------------------------------------------------------------
-- Goods Type ( Goods : Goods Type => 1 : 1)
CREATE TABLE IF NOT EXISTS m_category (
  category          serial,
  name              varchar(20),
  discription       text,

  is_delete         boolean DEFAULT false,
  regist_staff      integer,
  regist_time       timestamp,
  update_staff      integer,
  update_time       timestamp,

  PRIMARY KEY (category)
);

-- Goods Extra ( Goods Type : Goods Extra Type => 1 : N)
CREATE TABLE IF NOT EXISTS m_goods_sku_type (
  goods_sku_type serial,

  i01_name         text,
  i02_name         text,
  i03_name         text,
  i04_name         text,
  i05_name         text,
  n01_name         text,
  n02_name         text,
  n03_name         text,
  n04_name         text,
  n05_name         text,
  t01_name         text,
  t02_name         text,
  t03_name         text,
  t04_name         text,
  t05_name         text,

  discription       text,

  regist_staff      integer,
  regist_time       timestamp,
  update_staff      integer,
  update_time       timestamp,

  PRIMARY KEY (goods_sku_type)
);

CREATE INDEX ON m_goods_sku (goods_sku_type);

-- ----------------------------------------------------------------------------
-- CREATE Goods Material TABLE
-- ----------------------------------------------------------------------------
-- Goods Material ( Goods : Goods Material => N : N)
--  => To Link Goods and Material
CREATE TABLE IF NOT EXISTS m_goods_material (
  goods_material_id serial ,

  goods_id          integer NOT NULL,
  sku_id            integer DEFAULT NULL, -- SKU単位の素材設定の時に使う
  material_id       integer NOT NULL, 
  uses              text,                 -- 使用用途
  discription       text,

  --is_delete         boolean DEFAULT false, -- ここは物理削除
  regist_staff      integer,
  regist_time       timestamp,
  update_staff      integer,
  update_time       timestamp,

  PRIMARY KEY (goods_material_id)
);

-- ----------------------------------------------------------------------------
-- CREATE Material Kind TABLE
-- ----------------------------------------------------------------------------
-- Goods Material ( Goods : Goods Material => N : N)
--  => To Link Goods and Material
CREATE TABLE IF NOT EXISTS m_material_kind (
  material_kind     serial ,

  name              varchar(20),
  discription       text,

  is_delete         boolean DEFAULT false,
  regist_staff      integer,
  regist_time       timestamp,
  update_staff      integer,
  update_time       timestamp,

  PRIMARY KEY (material_kind)
);

-- ----------------------------------------------------------------------------
-- CREATE Material TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS m_material (
  material_id       serial,
  material_type     integer NOT NULL,
  name              text,
  maker_id          integer, -- Company Id

  unit_price        numeric,
  unit              varchar(20),          -- 単位
  tax               numeric,              -- For Reduced Tax Rate

  is_use_estimate   boolean DEFAULT true, -- 見積金額で使用するかどうか
  lot               text,
  discription       text,

  is_discontinued   boolean DEFAULT false, -- 廃版
  regist_staff      integer,
  regist_time       timestamp,
  update_staff      integer,
  update_time       timestamp,

  PRIMARY KEY (material_id)
);

-- Material Type ( Material : Material Type => 1 : 1)
CREATE TABLE IF NOT EXISTS m_material_type (
  material_type     serial,
  name              varchar(20),
  material_kind     integer,
  discription       text,

  is_delete         boolean DEFAULT false,
  regist_staff      integer,
  regist_time       timestamp,
  update_staff      integer,
  update_time       timestamp,

  PRIMARY KEY (material_type)
);

-- ----------------------------------------------------------------------------
-- CREATE Company, Company Staff TABLE
-- ----------------------------------------------------------------------------
-- Corporate Company or Indivisual Company
CREATE TABLE IF NOT EXISTS m_company (
  company_id           serial,
  name                 text    NOT NULL,
  regal_personality    varchar(10),
  regal_position_front boolean DEFAULT false,
  tel                  varchar(15), fax                  varchar(15),
  address              text,

  is_supplier          boolean NOT NULL, -- is Supplier
  is_customer          boolean NOT NULL, -- is Customer
  is_wholesale         boolean NOT NULL, -- Wholesale available

  payment_way          text,             -- Payment way
  closing_date         varchar(10),      -- Payment term, closing
  payment_date         varchar(10),      -- Payment term, payment

  discription          text,

  is_delete            boolean DEFAULT false,
  regist_staff         integer,
  regist_time          timestamp,
  update_staff         integer,
  update_time          timestamp,

  PRIMARY KEY (company_id)
);

-- Corporate Company's Staff
CREATE TABLE IF NOT EXISTS m_company_staff (
  company_id        integer,
  staff_id          integer,
  name              text    NOT NULL,
  tel               varchar(15),
  fax               varchar(15),
  address           text,
  discription       text,

  is_delete         boolean DEFAULT false,
  regist_staff      integer,
  regist_time       timestamp,
  update_staff      integer,
  update_time       timestamp,

  PRIMARY KEY (company_id, staff_id)
);

-- ----------------------------------------------------------------------------
-- CREATE Discount TABLE
-- ----------------------------------------------------------------------------
-- Companies with special discount
CREATE TABLE IF NOT EXISTS m_discount (
  -- require
  discount_id       serial,
  sku_id            integer NOT NULL, -- m_goods_sku sku_id
  company_id        integer NOT NULL,

  -- use either column
  ratio             numeric, -- Ratio of wholesale price to retail price.
  ws_price          numeric, -- tax exclude. -> refer to the tax on m_goods table
  rt_price          numeric, -- tax exclude. -> refer to the tax on m_goods table

  -- for duplicate jan code.
  jan               varchar(13),

  -- for sku content
  i01_name integer, i02_name integer, i03_name integer, i04_name integer, i05_name integer,
  n01_name numeric, n02_name numeric, n03_name numeric, n04_name numeric, n05_name numeric,
  t01_name text   , t02_name text   , t03_name text   , t04_name text   , t05_name text   ,
  
  discription       text,

  is_delete         boolean DEFAULT false, -- SKU単位のDeleteフラグを上書きする

  regist_staff      integer,
  regist_time       timestamp,
  update_staff      integer,
  update_time       timestamp,

  PRIMARY KEY (discount_id),
  UNIQUE (sku_id, company_id)
);
